<template>
    <div class="legal-content">
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: "LegalContent",
    data() {
      return {
        title: '',
        content: ''
      };
    },
    created() {
      this.updateContent();
    },
    watch: {
      '$route.params.section': 'updateContent'
    },
    methods: {
      updateContent() {
        const section = this.$route.params.section;
        switch (section) {
          case 'legal':
            this.title = 'Mentions légales';
            this.content = '';
            break;
          case 'cgu':
            this.title = "Conditions générales d'utilisation";
            this.content = "Votre contenu des CGU ici...";
            break;
          case 'privacy-policy':
            this.title = "Politique de confidentialité";
            this.content = "Votre contenu de la politique de confidentialité ici...";
            break;
          case 'refund-policy':
            this.title = "Politique de remboursement";
            this.content = "Votre contenu de la politique de remboursement ici...";
            break;
          case 'warranty-conditions':
            this.title = "Conditions de garantie";
            this.content = "Votre contenu des conditions de garantie ici...";
            break;
          case 'cookie-policy':
            this.title = "Politique de cookie";
            this.content = "Votre contenu de la politique de cookie ici...";
            break;
          case 'shipping-policy':
            this.title = "Politique de livraison";
            this.content = "Votre contenu de la politique de livraison ici...";
            break;
          case 'accessibility':
            this.title = "Accessibilité du site";
            this.content = "Votre contenu sur l'accessibilité du site ici...";
            break;
          default:
            this.title = 'Page non trouvée';
            this.content = 'Le contenu que vous recherchez est introuvable.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .legal-content {
    padding: 20px;
  }
  </style>
  