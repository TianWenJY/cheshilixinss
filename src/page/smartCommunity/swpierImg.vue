<template>
  <div class="container">
    <div class="wrapper">
      <swiper :options="swiperOption">
        <swiper-slide>
          <img class="swiper-img" src="http://gw.alicdn.com/imgextra/i2/176/O1CN01j92Qk91DAeCZwVnx7_!!176-0-lubanu.jpg" alt>
        </swiper-slide>
        <swiper-slide>
          <img class="swiper-img" src="http://gw.alicdn.com/imgextra/i2/176/O1CN01j92Qk91DAeCZwVnx7_!!176-0-lubanu.jpg" alt>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwiperImg',
  data () {
    return {
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .container {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   z-index: 99;
//   position: fixed;
//   left: 0;
//   right: 0;
//   top: 0;
//   bottom: 0;
//   opacity:0.7;
//   background-color: #000;
//   .wrapper {
//     img {
//         width: 50%;
//         margin: 0 auto;
//     }
//   }
// }
</style>