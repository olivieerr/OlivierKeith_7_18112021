<template>
  <div>
    <Nav></Nav>
    <!-- <Home></Home> bg -->
    <div class="container">
      <div class="profile-page tx-13">
        <Header></Header>
        <div class="row profile-body d-flex flex-row justify-content-center">
          <!-- Pour mettre de publication -->
          <!-- middle wrapper start -->
          <div class="col-xl-6 middle-wrapper">
            <PostWrite></PostWrite>
            <div class="row mt-4 mt-md-4 mt-lg-0">
              <div class="col-md-12">
                <div class="card rounded">
                  <div v-for="post in posts" :key="post.id">
                    <Post :post="post"></Post>
                  </div>
                  <!-- Modal update for comment and post start here -->
                  <UpdatePostModal></UpdatePostModal>
                  <UpdateComment></UpdateComment>
                  <!-- Modal update for comment and post end here -->
                  <!-- Modal image for comment and post start here -->
                  <PostModalImage></PostModalImage>
                  <CommentModalImage></CommentModalImage>
                  <!-- Modal update for comment and post start here -->
                </div>
              </div>
            </div>
          </div>
          <!-- middle wrapper end -->
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Nav from "../components/Nav.vue";
import Header from "../components/Header.vue";
import Post from "../components/Post.vue";
import PostWrite from "../components/PostWrite.vue";
import UpdatePostModal from "../components/modalUpdate.vue";
import UpdateComment from "../components/UpdateComment.vue";
import PostModalImage from "../components/postModalImage.vue";
import CommentModalImage from "../components/commentModalImage.vue";
import Footer from "@/components/Footer";
export default {
  name: "Home",
  components: {
    Nav,
    Header,
    Post,
    PostWrite,
    UpdatePostModal,
    UpdateComment,
    PostModalImage,
    CommentModalImage,
    Footer,
  },
  created() {
    this.$store.dispatch("getAllPost");
  },
  // Logique pour récuperer les datas depuis la base de données MySQL
  computed: {
    //  getting the current user via the state by mapGetters
    ...mapGetters(["user", "posts"]),
  },
};
</script>

<style lang="scss" scoped>
body {
  //background-color: #f9fafb;
  margin-top: 20px;
}
</style>