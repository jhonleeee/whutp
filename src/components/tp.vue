<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"></v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Welcome to Vuetify</h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br />please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community</a>
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">What's next?</h2>

        <v-row justify="center">
          <v-card class="mx-auto" max-width="344" id="card1">
            <v-card-text>
              <div>Word of the Day</div>
              <p class="display-1 text--primary rounded-bl-xl">be•nev•o•lent</p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.
                <br />"a benevolent smile"
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4">Learn More</v-btn>
            </v-card-actions>
          </v-card>
          <v-card class="mx-auto" max-width="344" id="card2">
            <v-card-text>
              <div>Word of the Day</div>
              <p class="display-1 text--primary">be•nev•o•lent</p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.
                <br />"a benevolent smile"
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4">Learn More</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Important Links</h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >{{ link.text }}</a>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Ecosystem</h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >{{ eco.text }}</a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { jsPlumb } from "jsplumb"; //https://zhuanlan.zhihu.com/p/41808577
export default {
  name: "TP",

  data: () => ({
    ecosystem: [
      {
        text: "vuetify-loader",
        href: "https://github.com/vuetifyjs/vuetify-loader",
      },
      {
        text: "github",
        href: "https://github.com/vuetifyjs/vuetify",
      },
      {
        text: "awesome-vuetify",
        href: "https://github.com/vuetifyjs/awesome-vuetify",
      },
    ],
    importantLinks: [
      {
        text: "Documentation",
        href: "https://vuetifyjs.com",
      },
      {
        text: "Chat",
        href: "https://community.vuetifyjs.com",
      },
      {
        text: "Made with Vuetify",
        href: "https://madewithvuejs.com/vuetify",
      },
      {
        text: "Twitter",
        href: "https://twitter.com/vuetifyjs",
      },
      {
        text: "Articles",
        href: "https://medium.com/vuetify",
      },
    ],
    whatsNext: [
      {
        text: "Explore components",
        href: "https://vuetifyjs.com/components/api-explorer",
      },
      {
        text: "Select a layout",
        href: "https://vuetifyjs.com/getting-started/pre-made-layouts",
      },
      {
        text: "Frequently Asked Questions",
        href:
          "https://vuetifyjs.com/getting-started/frequently-asked-questions",
      },
    ],
  }),
  mounted: function () {
    let jsPlumbIns = jsPlumb.getInstance();

    jsPlumbIns.ready(function () {
      jsPlumbIns.connect({
        source: "card1",
        target: "card2",
        endpoint: "Dot",
      });
    });
    console.log("fuckyou");
  },
};
</script>
