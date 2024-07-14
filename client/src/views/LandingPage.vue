<template>
  <div class="container-landing">
    <VideoPlayer :mediaItems="mediaItems"></VideoPlayer>
    <HighLight></HighLight>
    <TheSearch></TheSearch>
    <UniversDisplay></UniversDisplay>
  </div>
</template>

<script setup>
import VideoPlayer from "../ui/VideoPlayer.vue";
import TheSearch from "../components/landingPage/TheSearch.vue";
import HighLight from "../components/landingPage/HighLight.vue";
import UniversDisplay from "../components/landingPage/UniversDisplay.vue";
import { reactive } from "vue";

// ########################################## Api ##########################################

import KaidoImage from "../assets/images/figurines/kaido.webp";
import VideoTest from "../assets/videos/Slider vertical - Google Chrome 2022-04-04 01-36-14.mp4";

const mediaItems = reactive([
  {
    url: KaidoImage,
    isVideo: false,
    isYouTube: false,
    link: "https://google.com",
  },
  {
    url: "https://www.youtube.com/embed/dEsQzKe1kb4?si=gFbud-WCXiqAmJfq",
    isVideo: true,
    isYouTube: true,
    link: "https://www.darkanddarker.com/",
  },
  {
    url: VideoTest,
    isVideo: true,
    isYouTube: false,
    link: "https://google.com",
  },
]);
</script>

<style lang="scss" scoped>
.container-landing {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 100px;
}
</style>
