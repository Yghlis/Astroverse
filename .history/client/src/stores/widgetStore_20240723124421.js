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
        // Card details (snipped for brevity)
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
        
        this.cards.forEach(card => {
          switch (card.id) {
            case 1: // Total des Ventes
              card.sales = {
                day: data.salesByPeriod.dailySales || 0,
                month: data.salesByPeriod.monthlySales || 0,
                year: data.salesByPeriod.yearlySales || 0,
                total: data.salesByPeriod.totalSales || 0,
              };
              break;
            case 2: // Les Produits les plus Vendus
              card.items = data.totalProductSales.topProductSales.map(product => ({
                name: product.title,
                quantity: product.quantity,
              }));
              break;
            case 3: // Les catégories les plus vues
              card.items = data.topViewedCategories.map(category => ({
                name: category.universeName,
                quantity: parseInt(category.totalViews, 10),
              }));
              break;
            // Additional cases for other card types
          }
        });

        this.saveCards(); // Save updated cards

      } catch (error) {
        console.error("Fetch Error:", error);
      }
    },
    toggleCardActive(id) {
      const card = this.cards.find(card => card.id === id);
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
