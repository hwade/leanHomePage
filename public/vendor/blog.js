!function(e){"use strict";function t(e){return-1!==e.indexOf("//")}function a(e){return e.slice(0,e.lastIndexOf("/")+1)}function i(e){return-1!==e.toLowerCase().indexOf(".md")||-1!==e.toLowerCase().indexOf(".markdown")}function n(t,a){e(window).trigger(t,a)}function r(e,t){"/"==e[e.length-1]&&(e=e.substring(0,e.length-1));var a=e.split("/"),i=t.split("/");if("."==i[0])i.splice(0,1);else{if(".."!=i[0])return-1!=i[0].indexOf("http")||-1!=i[0].indexOf("https")?t:a.join("/")+"/"+i.join("/");a.splice(a.length-1,1),i.splice(0,1)}return r(a.join("/"),i.join("/"))}function o(f,s,g,m){var m=m||d,g=g||!1,p=m+s;e.ajax({type:"GET",url:p,success:function(o){marked.setOptions({highlight:function(e){return hljs.highlightAuto(e).value}});var s=e(f);if(s.html(marked(o)),s.find("[href]").each(function(){var n=e(this),o=n.attr("href");if(t(o)&&n.attr("target","_blank"),g&&i(o)&&n.attr("href","?"+o),!t(o)&&!g&&i(o)){var f=a(h);0==o.indexOf("../")?f=r(a(h),o):0==o.indexOf("__P__")?f=o.replace("__P__/",""):f+=o.replace("./",""),n.attr("href","?"+f)}}),!g){var c=e("#main-page").find("h1, h2, h3, h4, h5, h6").first().text();e("title").text(c),e.each(s.find("img"),function(t,a){var i=e(a).attr("alt")||"";-1!=i.indexOf("|left")?e(a).addClass("img-left"):-1!=i.indexOf("|right")?e(a).addClass("img-right"):e(a).addClass("img-center")})}g&&(s.find("img").first().addClass("avatar"),e.each(s.find("li"),function(t,a){e(a).addClass("sidebar-item")})),e.each(s.find("img"),function(t,i){var n=e(i);if(0==n.attr("src").indexOf("__IMG__"))n.attr("src",n.attr("src").replace("__IMG__",l));else{var o=r(a(p),n.attr("src"));n.attr("src",o)}}),"#sidebar-page"==f?n("loaded-sidebar-page"):"#main-page"==f?n("loaded-main-page"):"#main-page-footer"==f&&n("loaded-main-page-footer")},error:function(e){if(404===e.status){if("footer.md"===s)return void console.log("没有找到footer.md! 建议在p/目录下建立footer.md 文件来添加底部信息！");o("#main-page","404.md",!1,"/"+c+"/"),n("page-not-found",{selector:f,path:s})}}})}function f(t){e.ajax({method:"GET",url:"config.json",success:function(a){c=a.app_name||c,l=a.img_root||l;var i=a.description||"";g=a.markdown_root||g,d="/"+c+"/"+g+"/",e("meta[name=description]").first().attr("content",i),t()},error:function(e){alert("读取配置有误")}})}function s(){f(function(){n("before-load-sidebar-page"),o("#sidebar-page","sidebar.md",!0),n("before-load-main-page-footer"),o("#main-page-footer","footer.md"),h=-1!==location.search.indexOf("&")?location.search.slice(1,location.search.indexOf("&")):location.search.slice(1,location.search.length),"/"===h.charAt(h.length-1)&&(h=h.slice(0,location.search.length-2)),""!==h&&i(h)?(n("before-load-main-page"),o("#main-page",h)):(n("before-load-main-page"),o("#main-page","home.md"))})}var c="",d="",l="img",g="p",h="";s()}(Zepto);