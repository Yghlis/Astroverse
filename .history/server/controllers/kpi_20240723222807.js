import { Sequelize, Op, fn, col, literal } from 'sequelize';
import Product from '../models/Product.js';
import Universe from '../models/Universe.js';
import Follow from '../models/Follow.js';
import Order from '../models/Order.js';
import Favorite from '../models/Favorite.js';
import Character from '../models/Character.js';
import User from '../models/user.js';

const getStockChanges = async (productId) => {
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error('Produit non trouvé');
  }

  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: threeMonthsAgo,
      },
    },
  });

  const stockChanges = {
    productId: product.id,
    title: product.title,
    initialStock: product.stock,
    changes: [],
  };

  orders.forEach(order => {
    order.products.forEach(item => {
      if (item.productId === productId) {
        const change = {
          date: order.createdAt,
          quantity: -item.quantity,
        };
        stockChanges.changes.push(change);
      }
    });
  });

  return stockChanges;
};

const prepareChartData = (stockChanges) => {
  const data = [];
  const labels = [];
  let currentStock = stockChanges.initialStock;

  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    labels.unshift(date.toLocaleString('default', { month: 'short' }));
    data.unshift(currentStock);
  }

  stockChanges.changes.forEach(change => {
    const month = new Date(change.date).getMonth();
    const currentMonth = new Date().getMonth();
    const monthIndex = (currentMonth - month + 12) % 12;
    if (monthIndex < 3) {
      data[2 - monthIndex] += change.quantity;
    }
  });

  return {
    labels,
    data,
  };
};

export const getStockEvolution = async (req, res) => {
  const { productId } = req.query;

  try {
    const stockChanges = await getStockChanges(productId);
    const chartData = prepareChartData(stockChanges);
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTotalProductSales = async () => {
  try {
    const orders = await Order.findAll();
    const productSales = {};

    orders.forEach(order => {
      order.products.forEach(product => {
        if (productSales[product.productId]) {
          productSales[product.productId].quantity += product.quantity;
        } else {
          productSales[product.productId] = {
            productId: product.productId,
            quantity: product.quantity
          };
        }
      });
    });

    const productIds = Object.keys(productSales);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      }
    });

    const detailedProductSales = products.map(product => ({
      productId: product.id,
      title: product.title,
      quantity: productSales[product.id].quantity
    }));

    const topProductSales = detailedProductSales.sort((a, b) => b.quantity - a.quantity).slice(0, 3);

    return { topProductSales };
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getTotalProductSalesLandingPage = async () => {
  try {
    const orders = await Order.findAll();
    const productSales = {};

    orders.forEach(order => {
      order.products.forEach(product => {
        if (productSales[product.productId]) {
          productSales[product.productId].quantity += product.quantity;
        } else {
          productSales[product.productId] = {
            productId: product.productId,
            quantity: product.quantity
          };
        }
      });
    });

    const productIds = Object.keys(productSales);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      }
    });

    const detailedProductSales = products.map(product => ({
      productId: product.id,
      title: product.title,
      quantity: productSales[product.id].quantity,
    }));

    const topProductSales = detailedProductSales.sort((a, b) => b.quantity - a.quantity).slice(0, 10);

    return { topProductSales };
  } catch (error) {
    throw new Error('Internal server error');
  }
};

const generateDaysForCurrentMonth = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(now.getFullYear(), now.getMonth(), i));
  }
  return days;
};

const calculateDailySalesForMonth = async (startDate, endDate) => {
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    }
  });

  const dailySales = {};

  orders.forEach(order => {
    const day = new Date(order.createdAt).toISOString().split('T')[0];
    const totalQuantity = order.products.reduce((sum, product) => sum + product.quantity, 0);
    if (dailySales[day]) {
      dailySales[day] += totalQuantity;
    } else {
      dailySales[day] = totalQuantity;
    }
  });

  return Object.keys(dailySales).map(day => ({
    day: new Date(day),
    totalQuantity: dailySales[day]
  }));
};

export const getTotalSalesByPeriod = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const dailySalesForMonth = await calculateDailySalesForMonth(startOfMonth, now);
    const daysInMonth = generateDaysForCurrentMonth();
    const salesWithAllDays = daysInMonth.map(day => {
      const salesData = dailySalesForMonth.find(sale => sale.day.getTime() === day.getTime());
      return {
        day: day.toISOString(),
        totalQuantity: salesData ? salesData.totalQuantity : 0
      };
    });

    const monthlySales = salesWithAllDays.reduce((acc, sale) => acc + sale.totalQuantity, 0);

    return {
      monthlySales,
      dailySalesForMonth: salesWithAllDays
    };
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getTopViewedCategories = async () => {
  try {
    const topCategories = await Product.findAll({
      attributes: [
        'universe',
        [fn('SUM', col('views_count')), 'total_views']
      ],
      group: ['universe'],
      order: [[fn('SUM', col('views_count')), 'DESC']],
      limit: 3,
    });

    const universeIds = topCategories.map(category => category.universe);
    const universes = await Universe.findAll({
      where: {
        id: {
          [Op.in]: universeIds
        }
      }
    });

    const universeDetails = universes.reduce((acc, universe) => {
      acc[universe.id] = universe.name;
      return acc;
    }, {});

    const result = topCategories.map(category => ({
      universeId: category.universe,
      universeName: universeDetails[category.universe],
      totalViews: category.dataValues.total_views,
    }));

    return result;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getTopFollowedProducts = async () => {
  try {
    const follows = await Follow.findAll({
      attributes: [
        'productId',
        [fn('COUNT', col('productId')), 'follow_count']
      ],
      where: {
        productId: {
          [Op.ne]: null
        }
      },
      group: ['productId'],
      order: [[fn('COUNT', col('productId')), 'DESC']],
      limit: 3
    });

    const productIds = follows.map(follow => follow.productId);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      },
      attributes: ['id', 'title']
    });
    const result = follows.map(follow => {
      const product = products.find(p => p.id === follow.productId);
      return {
        productName: product ? product.title : null,
        followCount: follow.dataValues.follow_count
      };
    });

    return result;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getTopLikedProducts = async () => {
  try {
    const likes = await Favorite.findAll({
      attributes: [
        'productId',
        [fn('COUNT', col('productId')), 'like_count']
      ],
      where: {
        productId: {
          [Op.ne]: null
        }
      },
      group: ['productId'],
      order: [[fn('COUNT', col('productId')), 'DESC']],
      limit: 3
    });
    const productIds = likes.map(like => like.productId);
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds
        }
      },
      attributes: ['id', 'title'] 
    });
    const result = likes.map(like => {
      const product = products.find(p => p.id === like.productId);
      return {
        productName: product ? product.title : null,
        likeCount: like.dataValues.like_count
      };
    });

    return result;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getTotalNewsletterSubscribers = async () => {
  try {
    const totalSubscribers = await User.count({
      where: {
        isSubscribedToNewsletter: true
      }
    });

    return { totalSubscribers };
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const getNewsletterSubscriptionStats = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfThreeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const getStatsForPeriod = async (startDate) => {
      const newUsers = await User.findAll({
        where: {
          created_at: {
            [Op.gte]: startDate
          }
        },
        attributes: ['user_id', 'isSubscribedToNewsletter']
      });

      const newUserCount = newUsers.length;
      const subscribersCount = newUsers.filter(user => user.isSubscribedToNewsletter).length;
      const subscriptionPercentage = newUserCount > 0 ? (subscribersCount / newUserCount) * 100 : 0;

      return {
        newUserCount,
        subscribersCount,
        subscriptionPercentage
      };
    };

    const monthlyStats = await getStatsForPeriod(startOfMonth);
    const threeMonthlyStats = await getStatsForPeriod(startOfThreeMonthsAgo);
    const yearlyStats = await getStatsForPeriod(startOfYear);

    return {
      monthlyStats,
      threeMonthlyStats,
      yearlyStats
    };
  } catch (error) {
    throw new Error('Internal server error');
  }
};

const calculateDailyProfitsForMonth = async (startDate, endDate) => {
  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    attributes: [
      [fn('DATE_TRUNC', 'day', col('createdAt')), 'day'],
      [fn('SUM', col('totalPrice')), 'totalPrice'],
      [fn('SUM', col('tax')), 'tax']
    ],
    group: ['day'],
    order: [['day', 'ASC']]
  });

  return orders.map(order => ({
    day: order.getDataValue('day'),
    profit: parseFloat(order.getDataValue('totalPrice')) - parseFloat(order.getDataValue('tax'))
  }));
};

export const getProfitData = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailyProfitsForMonth = await calculateDailyProfitsForMonth(startOfMonth, now);

    const daysInMonth = generateDaysForCurrentMonth();

    // Combiner les jours et les profits
    const profitsWithAllDays = daysInMonth.map(day => {
      const profitData = dailyProfitsForMonth.find(profit => profit.day.getTime() === day.getTime());
      return {
        day: day.toISOString(),
        profit: profitData ? profitData.profit : 0
      };
    });

    return {
      dailyProfitsForMonth: profitsWithAllDays
    };
  } catch (error) {
    throw new Error('Internal server error');
  }
};

// Contrôleur pour obtenir le total des produits
export const getTotalProducts = async () => {
  try {
    const totalProducts = await Product.count();
    return { totalProducts };
  } catch (error) {
    throw new Error('Internal server error');
  }
};


export const getTotalUniverses = async () => {
  try {
    const totalUniverses = await Universe.count();
    return { totalUniverses };
  } catch (error) {
    throw new Error('Internal server error');
  }
};


export const getTotalCharacters = async () => {
  try {
    const totalCharacters = await Character.count();
    return { totalCharacters };
  } catch (error) {
    throw new Error('Internal server error');
  }
};


export const getAllKpis = async (req, res) => {
  try {
    const [
      totalProductSales,
      salesByPeriod,
      topViewedCategories,
      topFollowedProducts,
      topLikedProducts,
      totalNewsletterSubscribers,
      newsletterSubscriptionStats,
      profitData,
      totalProducts,
      totalUniverses,
      totalCharacters,
      topTenProductSales 
    ] = await Promise.all([
      getTotalProductSales(),
      getTotalSalesByPeriod(),
      getTopViewedCategories(),
      getTopFollowedProducts(),
      getTopLikedProducts(),
      getTotalNewsletterSubscribers(),
      getNewsletterSubscriptionStats(),
      getProfitData(),
      getTotalProducts(),
      getTotalUniverses(),
      getTotalCharacters(),
      getTotalProductSalesLandingPage() 
    ]);

    res.status(200).json({
      totalProductSales,
      salesByPeriod,
      topViewedCategories,
      topFollowedProducts,
      topLikedProducts,
      totalNewsletterSubscribers,
      newsletterSubscriptionStats,
      profitData,
      totalProducts,
      totalUniverses,
      totalCharacters,
      topTenProductSales 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
