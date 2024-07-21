

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
    gap: 10px;
    font-family: "Montserrat", sans-serif;
    button {
      width: 100%;
      padding: 20px 10px;
      background-color: white;
      color: black;
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
    }
  }

  .admin-content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s ease;
    &.active {
      width: calc(100% - 250px);
    }
  }
}
</style>
