<template>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Astroverse. All rights reserved.</p>
        <ul class="footer-links">
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  </template>
  
  <script setup>
  // No specific script logic is needed for this basic footer
  </script>
  
  <style lang="scss" scoped>
  .footer {
    background-color: #333;
    color: #fff;
    padding: 20px 0;
    text-align: center;
    margin-top: 100px;
  
    &-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
  
    &-links {
      list-style: none;
      padding: 0;
      margin: 10px 0 0;
      display: flex;
      justify-content: center;
  
      li {
        margin: 0 15px;
  
        a {
          color: #fff;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  </style>
  