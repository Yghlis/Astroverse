[plugin:vite:vue] [vue/compiler-sfc] Unexpected token, expected "," (105:7)

/home/node/src/components/admin/LineChart.vue
127|            },
128|          },
129|        };
130|      
131|        if (chartInstance.value) {
/home/node/src/components/admin/LineChart.vue:105:7
90 |      const labels = {
91 |        today: ["8h", "10h", "12h", "14h", "16h", "18h", "20h"],
92 |        currentMonth: Array.from({ length: 30 }, (_, i) => `Jour ${i + 1}`),
   |                                              ^
93 |        currentYear: monthsInFrench,
94 |        total: monthsInFrench,