<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <h2>Admin Options</h2>
      <div class="admin-options">
        <button
          :class="{ active: currentDataType === 'products' }"
          @click="fetchData('products')"
        >
          Produits
        </button>
        <button
          :class="{ active: currentDataType === 'users' }"
          @click="fetchData('users')"
        >
          Utilisateurs
        </button>
        <button
          :class="{ active: currentDataType === 'universes' }"
          @click="fetchData('universes')"
        >
          Univers
        </button>
        <button
          :class="{ active: currentDataType === 'characters' }"
          @click="fetchData('characters')"
        >
          Personnages
        </button>
      </div>
    </SideAdmin>
    <div class="admin-content" :class="{ active: showSideBar }">
      <AdminTable
        :data="tableData"
        :columns="tableColumns"
        :currentDataType="currentDataType"
        @edit="handleEdit"
        @view="handleView"
        @row-deleted="handleRowDeleted"
      />
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import AdminTable from "../components/admin/AdminTable.vue";
import { ref, onMounted } from "vue";

const showSideBar = ref(true);
const tableData = ref([]);
const tableColumns = ref([]);
const currentDataType = ref("");

const toggleNav = (newState) => {
  showSideBar.value = newState;
};

const apiUrl = import.meta.env.VITE_API_URL;

onMounted(() => {
  fetchData("products");
});

const fetchData = async (type) => {
  let url = "";
  let columns = [];

  switch (type) {
    case "products":
      url = `${apiUrl}/products`;
      columns = [
        "title",
        "brand",
        "price",
        "discounted_price",
        "character",
        "universe",
        "reference",
      ];
      break;
    case "universes":
      url = `${apiUrl}/universes`;
      columns = ["name", "color1", "color2", "colorText", "link"];
      break;
    case "characters":
      url = `${apiUrl}/characters`;
      columns = ["name", "universe"];
      break;
    case "users":
      url = `${apiUrl}/users`;
      columns = ["username", "email", "roles"];
      break;
    default:
      return;
  }

  currentDataType.value = type;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    const data = await response.json();

    // Transform user data to include 'username'
    if (type === "users") {
      tableData.value = data.map((user) => ({
        ...user,
        username: `${user.first_name} ${user.last_name}`,
      }));
    } else {
      tableData.value = data;
    }

    tableColumns.value = columns;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
};

const handleEdit = async (row) => {
  if (currentDataType.value === "universes") {
    const response = await fetch(`${apiUrl}/universes/${row.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await response.json();
    console.log("Editing Row:", data);
  } else if (currentDataType.value === "products") {
    const response = await fetch(`${apiUrl}/products/${row.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await response.json();
    console.log("Editing Row:", data);
  }
};

const handleView = async (row) => {
  if (currentDataType.value === "products") {
    const response = await fetch(`${apiUrl}/products/${row.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });
    const data = await response.json();
    console.log("Viewing Row:", data);
  }
};

const handleRowDeleted = (id) => {
  tableData.value = tableData.value.filter((row) => row.id !== id);
};
</script>

<style lang="scss" scoped>
.admin-container {
  display: flex;
  justify-content: flex-end;
  h2 {
    margin: 0;
    padding: 20px;
    background-color: white;
    color: black;
    font-size: 28px;
    text-align: center;
    width: 100%;
  }
  .admin-options {
    display: flex;
    flex-direction: column;
    margin: 0;
    width: 100%;
    button {
      width: 100%;
      padding: 20px 10px;
      background-color: white;
      color: black;
      border: none;
      font-size: 26px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover,
      &.active {
        background-color: #f2a45a;
        color: white;
      }
    }
  }

  .admin-content {
    width: 100%;
    height: 100vh;
    transition: all 0.3s ease;
    &.active {
      width: calc(100% - 250px);
    }
  }
}
</style>
