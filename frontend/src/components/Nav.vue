<template>
  <header>
    <nav
      class="
        navbar navbar-dark
        bg-banner bg-gradient
        d-flex
        justify-content-md-between
      "
    >
      <router-link
        :to="{ name: 'Home' }"
        class="a_logo navbar-brand d-flex justify-content-start"
      >
        <img
          class="img img-fluid d-inline align-left p-2"
          src="../assets/icon-above-font.png"
          alt="Groupomania logo"
        />
        <span class="p2 title title__style h6 align-self-center">
          <div class="align-items-start">Welcome to</div>
          <h1><div class="h5">GroupomaniaNetwork</div></h1>
        </span>
      </router-link>
      <nav class="navbar navbar-expand-md">
        <div class="container-fluid">
          <router-link :to="{ name: 'MyProfil' }" class="a_profil navbar-brand">
            <img
              class="
                img_profil
                rounded-circle
                img-fluid
                d-inline
                align-left
                p-2
                d-none d-lg-block
              "
              src="../assets/icon-above-font.png"
              alt="Groupomania logo"
            />
          </router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <font-awesome-icon :icon="['fas', 'arrow-down']" />
          </button>
          <div
            class="collapse navbar-collapse ml-auto hidden-sm-up float-md-right"
            id="navbarSupportedContent"
          >
            <ul class="navbar-nav ml-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link
                  :to="{ name: 'MyProfil' }"
                  class="
                    a_profil
                    nav-link
                    active
                    d-flex
                    flex-column
                    justify-content-end
                  "
                  aria-current="page"
                  href="#"
                >
                  <div class="d-flex flex-row d-md-none">
                    <img
                      class="
                        img_profil
                        rounded-circle
                        img-fluid
                        d-inline
                        align-left
                        p-2
                      "
                      src="../assets/icon-above-font.png"
                      alt="Groupomania logo"
                    />
                    <!-- Il faut utiliser computed pour mettre le nom et prenom -->
                    <!-- <span>{{user.name}}</span> -->
                    <span class="d-flex align-items-center"
                      >{{ user.firstName }} {{ user.lastName }}</span
                    ><br />
                  </div>
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'Home' }"
                  class="nav-link link text-white">
                  Accueil</router-link>
              </li>
              <li class="nav-item">
                <router-link
                  :to="{ name: 'Login' }"
                  href="javascript:void(0)"
                  @click="logOutClick"
                  class="nav-link link text-white">
                  Deconnexion
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
//  getting the current user via the state by mapGetters
export default {
  name: "Nav",

  methods: {
    logOutClick() {
      localStorage.clear("userToken");
      //  we need to dispatch this user to null
      this.$store.dispatch("user", null);
      this.$router.push({ name: "Login" });
    },
  },
  computed: {
    //  getting the current user via the state by mapGetters
    ...mapGetters(["user"]),
  },
};
</script>

<style lang="scss" scoped>
header {
  nav {
    .a_logo {
      .img {
        width: 5rem;
        height: auto;
      }
      .title {
        .bg-banner {
          background-color: #878787;
          @include fontFamilly;
        }
      }
    }
    .top {
      margin-top: -20px;
    }
    .a_profil {
      .img_profil {
        width: 4rem;
        height: auto;
      }
    }
  }
}
</style>