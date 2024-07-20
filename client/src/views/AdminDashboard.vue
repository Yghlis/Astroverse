<template>
  <div class="admin-container">
    <SideAdmin :showSideBar="showSideBar" @update:hideSideBarAdmin="toggleNav">
      <div class="admin-options">
        <button
          :class="{
            active: currentDataType === 'dashboard',
            mini: !showSideBar,
          }"
          @click="goToDashboard"
        >
          <span class="material-symbols-outlined"> dashboard </span>
          <transition name="fade-translate">
            <span v-if="showSideBar">Dashboard</span>
          </transition>
        </button>
        <button
          :class="{
            active: currentDataType === 'products',
            mini: !showSideBar,
          }"
          @click="fetchData('products')"
        >
          <span class="material-symbols-outlined"> store </span>
          <transition name="fade-translate">
            <span v-if="showSideBar">Produits</span>
          </transition>
        </button>
        <button
          :class="{ active: currentDataType === 'users', mini: !showSideBar }"
          @click="fetchData('users')"
        >
          <span class="material-symbols-outlined"> person </span>
          <transition name="fade-translate">
            <span v-if="showSideBar">Utilisateurs</span>
          </transition>
        </button>
        <button
          :class="{
            active: currentDataType === 'universes',
            mini: !showSideBar,
          }"
          @click="fetchData('universes')"
        >
          <span class="material-symbols-outlined"> category </span>
          <transition name="fade-translate">
            <span v-if="showSideBar">Univers</span>
          </transition>
        </button>
        <button
          :class="{
            active: currentDataType === 'characters',
            mini: !showSideBar,
          }"
          @click="fetchData('characters')"
        >
          <span class="material-symbols-outlined"> directions_walk </span>
          <transition name="fade-translate">
            <span v-if="showSideBar">Personnages</span>
          </transition>
        </button>
        <RouterLink
          :class="{
            active: currentDataType === 'characters',
            mini: !showSideBar,
          }"
          class="exit"
          to="/"
          ><span class="material-symbols-outlined"> move_item </span>
          <transition name="fade-translate">
            <span v-if="showSideBar">Sortir</span>
          </transition></RouterLink
        >
      </div>
    </SideAdmin>
    <div class="admin-content" :class="{ active: showSideBar }">
  
      <transition name="slide" mode="out-in">
        <TheDashboard v-if="currentDataType === 'dashboard'"></TheDashboard>
        <AdminTable
          :key="currentDataType"
          :data="tableData"
          :columns="tableColumns"
          :currentDataType="currentDataType"
          @edit="handleEdit"
          @view="handleView"
          @row-deleted="handleRowDeleted"
          v-else-if="reloadTable && currentDataType !== 'dashboard'"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import SideAdmin from "../ui/SideAdmin.vue";
import TheDashboard from "../components/admin/TheDashboard.vue";
import AdminTable from "../components/admin/AdminTable.vue";
import { ref, onMounted, provide } from "vue";

const showSideBar = ref(true);
const tableData = ref([]);
const tableColumns = ref([]);
const currentDataType = ref("dashboard");
const reloadTable = ref(true);

const handleReloadTable = () => {
  fetchData(currentDataType.value);
  reloadTable.value = false;
  setTimeout(() => {
    reloadTable.value = true;
  }, 10);
};

provide("reloadTable", handleReloadTable);

const toggleNav = (newState) => {
  showSideBar.value = newState;
};

const apiUrl = import.meta.env.VITE_API_URL;

const goToDashboard = () => {
  currentDataType.value = "dashboard";
};

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
  margin: 0;
  overflow: hidden;
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
    margin: 10px 0 0 0;
    width: 100%;
    height: 100%;
    font-family: "Montserrat", sans-serif;
    button,
    a {
      text-decoration: none;
      width: 100%;
      padding: 20px 20px 20px 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      background-color: white;
      color: #808080;
      border: none;
      font-size: 26px;
      font-family: "Montserrat", sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover,
      &.active {
        background-color: black;
        color: white;
      }
      &.mini {
        justify-content: flex-end;
      }
      &.exit {
        margin-top: auto;
        background-color: #ff0000;
        color: white;
        &:hover {
          background-color: #ff3333;
        }
      }
    }
  }

  .admin-content {
    width: calc(100% - 75px);
    min-height: 100vh;
    transition: width 0.5s ease;
    &.active {
      width: calc(100% - 300px);
    }
  }
}

.material-symbols-outlined {
  font-size: 35px;
  font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48;
  transition: transform 0.5s ease;
  &.alt {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }
}

//transtions fade-translate
.fade-translate-enter-active,
.fade-translate-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-translate-enter-from,
.fade-translate-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Transitions slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
