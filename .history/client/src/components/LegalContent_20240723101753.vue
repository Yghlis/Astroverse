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
            this.content = '<p><strong>1. Éditeur du Site</strong></p>
<ul>
<li>Nom de l&#39;entreprise : Astroverse</li>
<li>Adresse : 34 rue Juliette Savarin, 94000</li>
<li>Téléphone : 0625984606</li>
<li>Email : <a href='mailto:Astroverse@gmail.com' target='_blank' class='url'>Astroverse@gmail.com</a></li>

</ul>
<p><strong>2. Hébergeur</strong></p>
<ul>
<li>Nom de l&#39;hébergeur : Renderer</li>
<li>Adresse : 45 rue du Cavalier, 76000</li>
<li>Téléphone : 0176887766</li>
<li>Email : <a href='mailto:Heroku@gmail.com' target='_blank' class='url'>Heroku@gmail.com</a></li>

</ul>
';
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
  