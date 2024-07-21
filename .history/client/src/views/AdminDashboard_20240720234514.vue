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
        <button
          :class="{ active: currentDataType === 'orders' }"
          @click="fetchData('orders')"
        >
          Commandes
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
        v-if="reloadTable"
      />
    </div>
  </div>
</template>
