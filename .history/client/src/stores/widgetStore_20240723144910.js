import { defineStore } from "pinia";

const colors = [
  "#e5e1f8",
  "#f9f0e1",
  "#cef3fc",
  "#e1f8e5",
  "#f8e5e1",
  "#e5f4f8",
  "#f3e1f8",
  "#f8e1e1",
  "#e1f8f8",
  "#e1e5f8",
];

function assignColorsToCards(cards) {
  const uniqueColors = [...colors];
  const assignedColors = new Set();
  let colorIndex = 0;

  cards.forEach((card) => {
    if (assignedColors.size === uniqueColors.length) {
      assignedColors.clear();
    }

    while (assignedColors.has(uniqueColors[colorIndex])) {
      colorIndex = (colorIndex + 1) % uniqueColors.length;
    }

    card.backgroundColor = uniqueColors[colorIndex];
    assignedColors.add(uniqueColors[colorIndex]);
    colorIndex = (colorIndex + 1) % uniqueColors.length;
  });
}

export const useWidgetStore = defineStore("widget", {
  state: () => {
    const storedCards = localStorage.getItem("cardsWidget");
    const cards = storedCards
      ? JSON.parse(storedCards)
      : [
          {
            id: 1,
            type: "carte-3",
            title: "Total des Ventes",
            icon: "monetization_on",
            sales: {
              day: 120,
              month: 800,
              year: 5000,
              total: 15000,
            },
            active: true,
            x: 0,
            y: 0,
          },
          {
            id: 2,
            type: "carte-2",
            title: "Les Produits les plus Vendus",
            icon: "shopping_bag",
            items: [
              { name: "Produit 1", quantity: 120 },
              { name: "Produit 2", quantity: 90 },
              { name: "Produit 3", quantity: 80 },
            ],
            active: true,
            x: 1,
            y: 0,
          },
          {
            id: 3,
            type: "carte-2",
            title: "Les catégories les plus vues",
            icon: "shopping_bag",
            items: [
              { name: "Produit 1", quantity: 120 },
              { name: "Produit 2", quantity: 90 },
              { name: "Produit 3", quantity: 80 },
            ],
            active: true,
            x: 2,
            y: 0,
          },
          {
            id: 4,
            type: "carte-2",
            title: "Les produits les plus suivis",
            icon: "shopping_bag",
            items: [
              { name: "Produit 1", quantity: 120 },
              { name: "Produit 2", quantity: 90 },
              { name: "Produit 3", quantity: 80 },
            ],
            active: true,
            x: 0,
            y: 1,
          },
          {
            id: 5,
            type: "carte-2",
            title: "Les produits les plus likés",
            icon: "shopping_bag",
            items: [
              { name: "Produit 1", quantity: 120 },
              { name: "Produit 2", quantity: 90 },
              { name: "Produit 3", quantity: 80 },
            ],
            active: true,
            x: 1,
            y: 1,
          },
          {
            id: 6,
            type: "carte-1",
            title: "Total des utilisateurs abonnées a la newsletter",
            icon: "group",
            valueA: 2450,
            valueB: null,
            typeArrow: "up",
            active: true,
            x: 2,
            y: 1,
          },
          {
            id: 7,
            type: "carte-3",
            title: "Graphique bénéfices",
            icon: "monetization_on",
            dailyProfitsForMonth: [
              {
                day: "2024-07-01T00:00:00.000Z",
                profit: 0,
              },
              {
                day: "2024-07-02T00:00:00.000Z",
                profit: 50,
              },
            ],
            active: true,
            x: 0,
            y: 3,
          },
          {
            id: 8,
            type: "carte-1",
            title: "Total des produits",
            icon: "trending_up",
            valueA: 1200,
            valueB: null,
            typeArrow: "down",
            active: true,
            x: 1,
            y: 3,
          },
          {
            id: 9,
            type: "carte-1",
            title: "Total des univers",
            icon: "trending_up",
            valueA: 1200,
            valueB: null,
            typeArrow: "down",
            active: true,
            x: 2,
            y: 3,
          },
          {
            id: 10,
            type: "carte-1",
            title: "Total des personnages",
            icon: "trending_up",
            valueA: 1200,
            valueB: null,
            typeArrow: "down",
            active: true,
            x: 0,
            y: 4,
          },
        ];
    assignColorsToCards(cards);
    return { cards };
  },

  actions: {
    async fetchKpi() {
      const token = localStorage.getItem("jwt");
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${apiUrl}/kpi/all-kpis`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Échec de la récupération des KPI");
        }

        const data = await response.json();
        console.log(data);

        // Mettre à jour les cartes en fonction du titre
        this.cards.forEach((card) => {
          switch (card.title) {
            case "Total des Ventes":
              card.sales = {
                day: data.salesByPeriod.dailySales || 0,
                month: data.salesByPeriod.monthlySales || 0,
                year: data.salesByPeriod.yearlySales || 0,
                total: data.salesByPeriod.totalSales || 0,
              };
              break;
            case "Les Produits les plus Vendus":
              card.items = data.totalProductSales.topProductSales.map(
                (product) => ({
                  name: product.title,
                  quantity: product.quantity,
                })
              );
              break;
            case "Les catégories les plus vues":
              card.items = data.topViewedCategories.map((category) => ({
                name: category.universeName,
                quantity: parseInt(category.totalViews, 10),
              }));
              break;
            case "Les produits les plus suivis":
              card.items = data.topFollowedProducts.map((product) => ({
                name: product.productName,
                quantity: parseInt(product.followCount, 10),
              }));
              break;
            case "Les produits les plus likés":
              card.items = data.topLikedProducts.map((product) => ({
                name: product.productName,
                quantity: parseInt(product.likeCount, 10),
              }));
              break;
            case "Total des utilisateurs abonnées a la newsletter":
              card.valueA = data.totalNewsletterSubscribers.totalSubscribers;
              break;
            case "Graphique bénéfices":
              card.dailyProfitsForMonth =
                data.profitData.dailyProfitsForMonth.map((profit) => ({
                  day: profit.day,
                  profit: profit.profit,
                }));
              break;
            case "Total des produits":
              card.valueA = data.totalProducts.totalProducts;
              break;
            case "Total des univers":
              card.valueA = data.totalUniverses.totalUniverses;
              break;
            case "Total des personnages":
              card.valueA = data.totalCharacters.totalCharacters;
              break;
            // Ajouter des cas supplémentaires si nécessaire
          }
        });
        this.saveCards;
      } catch (error) {
        console.error("Échec de la mise à jour de l'utilisateur :", error);
      }
    },
    toggleCardActive(id) {
      const card = this.cards.find((card) => card.id === id);
      if (card) {
        card.active = !card.active;
        this.saveCards();
      }
    },
    saveCards() {
      localStorage.setItem("cardsWidget", JSON.stringify(this.cards));
    },
    deleteLocalCards() {
      localStorage.removeItem("cardsWidget");
    },
    setCards(cards) {
      this.cards = cards;
      this.saveCards();
    },
  },
});
