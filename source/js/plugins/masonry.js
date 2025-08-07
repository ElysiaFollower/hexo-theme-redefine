export function initMasonry() {
  var loadingPlaceholder = document.querySelector(".loading-placeholder");
  var masonryContainer = document.querySelector("#masonry-container");
  if (!loadingPlaceholder || !masonryContainer) return;

  loadingPlaceholder.style.display = "flex";


  // 2. 将我们所有的核心逻辑，放入 window.onload 事件监听器中
  // 这能确保它在所有资源（CSS、图片占位符）都已加载并渲染完毕后才执行
  window.addEventListener('load', function() {
    
    // 3. 在正确的时机，用正确的尺寸，初始化瀑布流
    const masonry = new MiniMasonry({
      container: masonryContainer,
      baseWidth: window.innerWidth >= 768 ? 255 : 150,
      gutterX: 10,
      gutterY: 10,
      surroundingGutter: false,
    });

    // 4. 优雅地“交接”：淡出加载动画，淡入已完美布局的瀑布流
    loadingPlaceholder.style.opacity = 0;
    setTimeout(() => {
      loadingPlaceholder.style.display = "none";
      masonryContainer.style.display = "block";
      // 触发CSS中定义的 opacity transition
      masonryContainer.style.opacity = 1;
    }, 200); // 这个延迟是为了让淡出动画有时间播放

    // 5. 懒加载的“桥梁”保持不变，用于处理后续的滚动加载
    document.addEventListener('lazyloaded', (e) => {
      if (e.target.closest('#masonry-container')) {
        setTimeout(() => {
          masonry.layout();
        }, 200);
      }
    });

  }, { once: true }); // 使用 { once: true } 确保这个 onload 事件只运行一次，避免重复绑定


  // requestAnimationFrame(() => {
  //   //立即初始化 MiniMasonry 布局引擎
  //   var masonry = new MiniMasonry({
  //     container: masonryContainer,
  //     baseWidth: window.innerWidth >= 768 ? 255 : 150, // 保持主题原有的响应式基础宽度
  //     gutterX: 10,
  //     gutterY: 10,
  //     surroundingGutter: false,
  //   });
  //   masonry.layout();
  // });window.onload


  // loadingPlaceholder.style.display = "none";
  // masonryContainer.style.display = "block";
  // masonryContainer.style.opacity = 1;
}

if (data.masonry) {
  try {
    swup.hooks.on("page:view", initMasonry);
  } catch (e) {}

  document.addEventListener("DOMContentLoaded", initMasonry);
}



// export function initMasonry() {
//   var loadingPlaceholder = document.querySelector(".loading-placeholder");
//   var masonryContainer = document.querySelector("#masonry-container");
//   if (!loadingPlaceholder || !masonryContainer) return;

//   loadingPlaceholder.style.display = "block";
//   masonryContainer.style.display = "none";

//   var images = document.querySelectorAll(
//     "#masonry-container .masonry-item img",
//   );
//   var loadedCount = 0;

//   function onImageLoad() {
//     loadedCount++;
//     if (loadedCount === images.length) {
//       initializeMasonryLayout();
//     }
//   }

//   for (var i = 0; i < images.length; i++) {
//     var img = images[i];
//     if (img.complete) {
//       onImageLoad();
//     } else {
//       img.addEventListener("load", onImageLoad);
//     }
//   }

//   if (loadedCount === images.length) {
//     initializeMasonryLayout();
//   }
//   function initializeMasonryLayout() {
//     loadingPlaceholder.style.opacity = 0;
//     setTimeout(() => {
//       loadingPlaceholder.style.display = "none";
//       masonryContainer.style.display = "block";
//       var screenWidth = window.innerWidth;
//       var baseWidth;
//       if (screenWidth >= 768) {
//         baseWidth = 255;
//       } else {
//         baseWidth = 150;
//       }
//       var masonry = new MiniMasonry({
//         baseWidth: baseWidth,
//         container: masonryContainer,
//         gutterX: 10,
//         gutterY: 10,
//         surroundingGutter: false,
//       });
//       masonry.layout();
//       masonryContainer.style.opacity = 1;
//     }, 100);
//   }
// }

// if (data.masonry) {
//   try {
//     swup.hooks.on("page:view", initMasonry);
//   } catch (e) {}

//   document.addEventListener("DOMContentLoaded", initMasonry);
// }
