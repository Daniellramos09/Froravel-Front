# 🌸 Referência de UI/UX & Arquitetura Visual — Florável (Base Ataccama FWRD 2026)

Este documento guarda integralmente o HTML de referência enviado para orientar a evolução visual, microinterações e redistribuição de conteúdo da **Landing Page da Florável**.

---

## 🎯 Diretrizes de Adaptação para a Florável

1. **Seção de Psicólogos (Flip Cards com `+`)**:
   - Na seção onde a referência exibe os *Featured speakers* (`fwrd-2026-flip-card` em carrossel com foto recortada, fundo colorido suave e botão circular `+` no canto superior direito), **adaptar para os Psicólogos Perinatais da Florável**:
     - **Frente do card**: Foto do(a) psicólogo(a), Nome, Especialidade Perinatal e CRP.
     - **Verso do card (ao clicar no `+`)**: Mensagem de acolhimento do(a) profissional para as mães, abordagem clínica e link direto para agendamento/conhecer mais.
2. **Redistribuição de Conteúdo (Sair da "Tela Única" Sobrecarregada)**:
   - Em vez de concentrar tudo em uma única página longa, transformar a Landing Page em uma **porta de entrada leve e objetiva** (Hero, Contexto, 3 Pilares: *Acolher, Perceber, Conectar*, Prévia com links e Convite final).
   - Redirecionar os blocos aprofundados para rotas dedicadas (`Sobre nós`, `Explorar`, `Para Profissionais`, `Para Empresas / Corporate`, `Planos`, `Impacto / Apoie` e `Contato`).
3. **Interações da Referência**:
   - Cards com recorte orgânico/assimétrico (*cutout corners*), botão expansível `+ / -`, carrossel horizontal suave, paleta oficial da Florável (`#294D33`, `#E8A9BB`, `#516B55`, `#F4DDE5`, `#FCF7F9`) e tipografia `Fraunces` + `DM Sans`.

---

## 📄 Código HTML Completo da Referência

```html
<!DOCTYPE html>
<html lang="en-US" itemscope="" itemtype="https://schema.org/WebPage">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>
      Ataccama FWRD 2026: Press play on what&#39;s next in data trust | Ataccama
    </title>
    <link href="https://cdn.ataccama.com/dist/ata/main-qGdQcxOC.css" rel="preload" as="style" onload="console.log(&#39;loaded&#39;);this.onload=null;this.rel=&#39;stylesheet&#39;" />
    <noscript>
      &lt;link rel=&#34;stylesheet&#34; href=&#34;https://cdn.ataccama.com/dist/ata/main-qGdQcxOC.css&#34;&gt;
    </noscript>
    <meta name="robots" content="max-image-preview:large" />
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
    <link rel="alternate" type="application/rss+xml" title="Ataccama » Feed" href="https://www.ataccama.com/feed" />
    <link rel="alternate" type="application/rss+xml" title="Ataccama » Comments Feed" href="https://www.ataccama.com/comments/feed" />
    <link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://www.ataccama.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.ataccama.com%2Ffwrd2026" />
    <link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="https://www.ataccama.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.ataccama.com%2Ffwrd2026&amp;format=xml" />
    <style id="wp-img-auto-sizes-contain-inline-css">
      img:is([sizes=auto i],[sizes^=&#34;auto,&#34; i]){contain-intrinsic-size:3000px 1500px} /*# sourceURL=wp-img-auto-sizes-contain-inline-css */
    </style>
    <link rel="stylesheet" id="theme-style-css" href="https://cdn.ataccama.com/dist/ata/critical-DnZ7aEvY.css" media="screen" />
    <link rel="stylesheet" id="fonts-style-css" href="https://cdn.ataccama.com/dist/ata/cdn_fonts-CDTIcF_d.css" media="" />
    <style id="wp-emoji-styles-inline-css">
      img.wp-smiley, img.emoji { display: inline !important; border: none !important; box-shadow: none !important; height: 1em !important; width: 1em !important; margin: 0 0.07em !important; vertical-align: -0.1em !important; background: none !important; padding: 0 !important; } /*# sourceURL=wp-emoji-styles-inline-css */
    </style>
    <style id="wp-block-library-inline-css">
      :root{--wp-block-synced-color:#7a00df;--wp-block-synced-color--rgb:122,0,223;--wp-bound-block-color:var(--wp-block-synced-color);--wp-editor-canvas-background:#ddd;--wp-admin-theme-color:#007cba;--wp-admin-theme-color--rgb:0,124,186;--wp-admin-theme-color-darker-10:#006ba1;--wp-admin-theme-color-darker-10--rgb:0,107,160.5;--wp-admin-theme-color-darker-20:#005a87;--wp-admin-theme-color-darker-20--rgb:0,90,135;--wp-admin-border-width-focus:2px}@media (min-resolution:192dpi){:root{--wp-admin-border-width-focus:1.5px}}.wp-element-button{cursor:pointer}:root .has-very-light-gray-background-color{background-color:#eee}:root .has-very-dark-gray-background-color{background-color:#313131}:root .has-very-light-gray-color{color:#eee}:root .has-very-dark-gray-color{color:#313131}:root .has-vivid-green-cyan-to-vivid-cyan-blue-gradient-background{background:linear-gradient(135deg,#00d084,#0693e3)}:root .has-purple-crush-gradient-background{background:linear-gradient(135deg,#34e2e4,#4721fb 50%,#ab1dfe)}:root .has-hazy-dawn-gradient-background{background:linear-gradient(135deg,#faaca8,#dad0ec)}:root .has-subdued-olive-gradient-background{background:linear-gradient(135deg,#fafae1,#67a671)}:root .has-atomic-cream-gradient-background{background:linear-gradient(135deg,#fdd79a,#004a59)}:root .has-nightshade-gradient-background{background:linear-gradient(135deg,#330968,#31cdcf)}:root .has-midnight-gradient-background{background:linear-gradient(135deg,#020381,#2874fc)}:root{--wp--preset--font-size--normal:16px;--wp--preset--font-size--huge:42px}.has-regular-font-size{font-size:1em}.has-larger-font-size{font-size:2.625em}.has-normal-font-size{font-size:var(--wp--preset--font-size--normal)}.has-huge-font-size{font-size:var(--wp--preset--font-size--huge)}:root .has-text-align-center{text-align:center}:root .has-text-align-left{text-align:left}:root .has-text-align-right{text-align:right}.has-fit-text{white-space:nowrap!important}#end-resizable-editor-section{display:none}.aligncenter{clear:both}.items-justified-left{justify-content:flex-start}.items-justified-center{justify-content:center}.items-justified-right{justify-content:flex-end}.items-justified-space-between{justify-content:space-between}.screen-reader-text{word-wrap:normal!important;border:0;clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;word-break:normal!important}.screen-reader-text:focus{background-color:#ddd;clip-path:none;color:#444;display:block;font-size:1em;height:auto;left:5px;line-height:normal;padding:15px 23px 14px;text-decoration:none;top:5px;width:auto;z-index:100000}html :where(.has-border-color){border-style:solid}html :where([style^=border-color],[style*=&#34;;border-color&#34;],[style*=&#34;; border-color&#34;]){border-style:solid}html :where([style^=border-top-color],[style*=&#34;;border-top-color&#34;],[style*=&#34;; border-top-color&#34;]){border-top-style:solid}html :where([style^=border-right-color],[style*=&#34;;border-right-color&#34;],[style*=&#34;; border-right-color&#34;]){border-right-style:solid}html :where([style^=border-bottom-color],[style*=&#34;;border-bottom-color&#34;],[style*=&#34;; border-bottom-color&#34;]){border-bottom-style:solid}html :where([style^=border-left-color],[style*=&#34;;border-left-color&#34;],[style*=&#34;; border-left-color&#34;]){border-left-style:solid}html :where([style^=border-width],[style*=&#34;;border-width&#34;],[style*=&#34;; border-width&#34;]){border-style:solid}html :where([style^=border-top-width],[style*=&#34;;border-top-width&#34;],[style*=&#34;; border-top-width&#34;]){border-top-style:solid}html :where([style^=border-right-width],[style*=&#34;;border-right-width&#34;],[style*=&#34;; border-right-width&#34;]){border-right-style:solid}html :where([style^=border-bottom-width],[style*=&#34;;border-bottom-width&#34;],[style*=&#34;; border-bottom-width&#34;]){border-bottom-style:solid}html :where([style^=border-left-width],[style*=&#34;;border-left-width&#34;],[style*=&#34;; border-left-width&#34;]){border-left-style:solid}html :where(img[class*=wp-image-]){height:auto;max-width:100%}:where(figure){margin:0 0 1em}html :where(.is-position-sticky){--wp-admin--admin-bar--position-offset:var(--wp-admin--admin-bar--height,0px)}@media screen and (max-width:600px){html :where(.is-position-sticky){--wp-admin--admin-bar--position-offset:0px}} 
/*# sourceURL=https://cdn.ataccama.com/dist/wp/css/block-library/common.min.css */
    </style>
    <link rel="stylesheet" id="auth0-widget-css" href="https://www.ataccama.com/wp-content/plugins/auth0/assets/css/main.css" media="all" />
    <link rel="stylesheet" id="ataccama-style-css" href="https://www.ataccama.com/wp-content/themes/ataccama/style.css" media="all" />
    <script id="ataccama-datalayer-logger-js-extra">
      var AtaccamaDL = {&#34;rest_url&#34;:&#34;https://www.ataccama.com/wp-json/ataccama/v1/log&#34;,&#34;nonce&#34;:&#34;62529dda26&#34;,&#34;allowed_urls&#34;:[&#34;/learn/insurance&#34;]};
//# sourceURL=ataccama-datalayer-logger-js-extra
    </script>
    <script id="ataccama-datalayer-logger-js" src="https://www.ataccama.com/wp-content/plugins/ata-datalayer-logger/js/logger-min.js">
    </script>
    <script data-wp-strategy="defer" defer="" id="svgxuse-js" src="https://cdnjs.cloudflare.com/ajax/libs/svgxuse/1.2.6/svgxuse.min.js">
    </script>
    <script type="module" src="https://cdn.ataccama.com/dist/ata/main-DgYDMKyi.js" id="theme-script-js">
    </script>
    <link rel="https://api.w.org/" href="https://www.ataccama.com/wp-json/" />
    <link rel="alternate" title="JSON" type="application/json" href="https://www.ataccama.com/wp-json/wp/v2/pages/13449" />
    <link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://www.ataccama.com/xmlrpc.php?rsd" />
    <link rel="canonical" href="https://www.ataccama.com/fwrd2026" />
    <link rel="shortlink" href="https://www.ataccama.com/?p=13449" />
    <script type="application/ld+json">
      {&#34;@context&#34;:&#34;https://schema.org&#34;,&#34;@graph&#34;:[{&#34;@type&#34;:&#34;Organization&#34;,&#34;@id&#34;:&#34;https://www.ataccama.com/#organization&#34;,&#34;name&#34;:&#34;Ataccama&#34;,&#34;legalName&#34;:&#34;Ataccama Corp.&#34;,&#34;slogan&#34;:&#34;Trust your data, accelerate your AI&#34;,&#34;url&#34;:&#34;https://www.ataccama.com&#34;,&#34;logo&#34;:{&#34;@type&#34;:&#34;ImageObject&#34;,&#34;@id&#34;:&#34;https://www.ataccama.com/#logo&#34;,&#34;url&#34;:&#34;https://cdn.ataccama.com/dist/ata/images/brand/logos/ataccama-logo-black.svg&#34;,&#34;width&#34;:141,&#34;height&#34;:21,&#34;caption&#34;:&#34;Ataccama&#34;},&#34;description&#34;:&#34;Ataccama is a unified data trust platform that combines data quality, data observability, master data management, and data governance into a single AI-powered solution, helping enterprises keep their data accurate, governed, and reliable.&#34;,&#34;foundingDate&#34;:&#34;2007&#34;,&#34;numberOfEmployees&#34;:{&#34;@type&#34;:&#34;QuantitativeValue&#34;,&#34;minValue&#34;:500},&#34;address&#34;:{&#34;@type&#34;:&#34;PostalAddress&#34;,&#34;streetAddress&#34;:&#34;116 Huntington Ave&#34;,&#34;addressLocality&#34;:&#34;Boston&#34;,&#34;addressRegion&#34;:&#34;MA&#34;,&#34;postalCode&#34;:&#34;02116&#34;,&#34;addressCountry&#34;:&#34;US&#34;},&#34;contactPoint&#34;:[{&#34;@type&#34;:&#34;ContactPoint&#34;,&#34;contactType&#34;:&#34;sales&#34;,&#34;url&#34;:&#34;https://www.ataccama.com/contact&#34;},{&#34;@type&#34;:&#34;ContactPoint&#34;,&#34;contactType&#34;:&#34;customer support&#34;,&#34;url&#34;:&#34;https://support.ataccama.com&#34;}],&#34;award&#34;:[&#34;Leader, 2026 Gartner Magic Quadrant for Augmented Data Quality Solutions (5th consecutive year)&#34;,&#34;Leader, The Forrester Wave: Data Quality Solutions, Q1 2026&#34;],&#34;knowsAbout&#34;:[&#34;Data quality&#34;,&#34;Data governance&#34;,&#34;Master data management&#34;,&#34;Data observability&#34;,&#34;Data catalog&#34;,&#34;Metadata management&#34;,&#34;Data lineage&#34;,&#34;Reference data management&#34;,&#34;Data profiling&#34;,&#34;Ataccama ONE AI&#34;,&#34;ONE AI Agent&#34;],&#34;sameAs&#34;:[&#34;https://www.linkedin.com/company/ataccama&#34;,&#34;https://www.youtube.com/@ataccama&#34;,&#34;https://www.facebook.com/Ataccama&#34;,&#34;https://github.com/ataccama&#34;,&#34;https://vimeo.com/ataccama&#34;,&#34;https://www.g2.com/sellers/ataccama&#34;,&#34;https://www.crunchbase.com/organization/ataccama&#34;]},{&#34;@type&#34;:&#34;WebSite&#34;,&#34;@id&#34;:&#34;https://www.ataccama.com/#website&#34;,&#34;name&#34;:&#34;Ataccama&#34;,&#34;url&#34;:&#34;https://www.ataccama.com/&#34;,&#34;publisher&#34;:{&#34;@id&#34;:&#34;https://www.ataccama.com/#organization&#34;},&#34;potentialAction&#34;:{&#34;@type&#34;:&#34;SearchAction&#34;,&#34;target&#34;:&#34;https://www.ataccama.com/search?q={search_term_string}&#34;,&#34;query-input&#34;:&#34;required name=search_term_string&#34;},&#34;license&#34;:&#34;https://creativecommons.org/licenses/by-sa/4.0/&#34;,&#34;acquireLicensePage&#34;:&#34;https://www.ataccama.com/legal/content-licensing/&#34;,&#34;inLanguage&#34;:&#34;en-US&#34;},{&#34;@type&#34;:&#34;BreadcrumbList&#34;,&#34;itemListElement&#34;:[{&#34;@type&#34;:&#34;ListItem&#34;,&#34;position&#34;:1,&#34;name&#34;:&#34;Home&#34;,&#34;item&#34;:&#34;https://www.ataccama.com/&#34;},{&#34;@type&#34;:&#34;ListItem&#34;,&#34;position&#34;:2,&#34;name&#34;:&#34;FWRD 2026 – Awards version&#34;}]}]}
    </script>
    <meta name="page-url" content="https://www.ataccama.com/fwrd2026" />
    <link rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/" />
    <meta property="og:title" content="Ataccama FWRD 2026: Press play on what&#39;s next in data trust" />
    <meta property="og:description" content="Rewind through the shifts in data quality, agentic data management, and governed context that shaped trusted AI in 2026, then fast-forward to what’s ahead in 2027." />
    <meta name="description" content="Rewind through the shifts in data quality, agentic data management, and governed context that shaped trusted AI in 2026, then fast-forward to what’s ahead in 2027." />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="twitter:image" content="https://www.ataccama.com/wp-content/uploads/2026/10/Ataccama-FWRD-2026-OG-1.webp?v=1792499414" />
    <meta property="og:image" content="https://www.ataccama.com/wp-content/uploads/2026/10/Ataccama-FWRD-2026-OG-1.webp?v=1792499414" />
    <link rel="icon" href="https://cdn.ataccama.com/assets/2024/12/cropped-favicon-32x32.png" sizes="32x32" />
    <link rel="icon" href="https://cdn.ataccama.com/assets/2024/12/cropped-favicon-192x192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="https://cdn.ataccama.com/assets/2024/12/cropped-favicon-180x180.png" />
    <meta name="msapplication-TileImage" content="https://cdn.ataccama.com/assets/2024/12/cropped-favicon-270x270.png" />
    <script>
      window.dataLayer = window.dataLayer || [];
          function gtag() { window.dataLayer.push(arguments); }
    </script>
    <!-- FWRD Cricital CSS -->
    <style>
      body{font-family: &#34;Poppins&#34;, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, Arial, &#34;Noto Sans&#34;, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;} .fst-italic{font-style: italic;} .fw-semibold{font-weight: 600;} .lh-120{line-height: 1.2} .icon{display:inline-block;width:16px;height:16px;stroke-width:0;stroke:currentColor;fill:currentColor}.icon-24{width:24px;height:24px}.icon-32{width:32px;height:32px}.icon-container-48{width:48px;height:48px}.btn-icon{display:inline-block;width:24px;height:24px;stroke-width:0;stroke:currentColor;fill:currentColor}.fwrd-btn,.fwrd-btn-wrap,.overflow-hidden{overflow:hidden}.fwrd-btn:hover .fwrd-btn-text,.menu-sticky-universal{transform:translateY(-100%)}*{margin:0}.bg-purple{background-color:#6a2cf5}.bg-navy{background-color:#1a0c42}.min-vh-screen{min-height:calc(100vh - var(--wp-admin--admin-bar--height,0px))}.text-fwrd-green{color:#dcf938}.fwrd-btn,.fwrd-link-dark{color:#fff}.fs-sm-56{font-size:56px}.d-flex{display:flex}.justify-content-between{justify-content:space-between}.align-items-center{align-items:center}.flex-column{flex-direction:column}.d-md-none,.fwrd-menu-wrapper{display:none}.position-relative{position:relative}.position-absolute{position:absolute}.text-center{text-align:center}.w-100{width:100%}.h-100{height:100%}.menu{display:flex;align-items:center;z-index:999}.menu-sticky-universal{opacity:0}@media (max-width:1279.98px){.menu-sticky-phone-tablet{position:sticky;top:0}.fwrd-menu-wrapper{width:calc(100% + 48px)!important;border-top:1px solid #ac8af9}}@media (min-width:780px){.menu-sticky-phone-tablet{top:calc(0px + var(--wp-admin--admin-bar--height,0px))}}@media (min-width:1280px){.menu,.menu-md-96{height:96px}.menu-sticky-phone-tablet{top:initial}}.img-w-210{width:210px}@media (min-width:780px){.fwrd-menu-wrapper{width:calc(100% + 112px)!important}}.fwrd-btn{display:inline-flex;justify-content:center;align-items:center;padding-left:20px;padding-right:4px;height:42px;font-size:14px;border-radius:42px;font-weight:700;text-decoration:none;border:2px solid #e1f860;outline:0;transition-duration:.4s;cursor:pointer}.fwrd-btn-wrap{position:relative}.fwrd-btn-text{transform:translateY(0);transition-duration:.3s}.fwrd-btn-text.is-duplicate{position:absolute;top:120%;transform:translateY(0)}.fwrd-btn-arrow{width:33px;height:33px;transform:scale(0) translate(100%);margin-right:-26px;transition:margin-right .4s,transform .4s .1s}.fwrd-btn:hover{border-color:#dcf938;color:#000;background-color:#dcf938}.fwrd-btn:hover .fwrd-btn-text.is-duplicate{transform:translateY(-120%)}.fwrd-btn:hover .fwrd-btn-arrow{transform:scale(1) translate(0);margin-right:0}.fwrd-link-dark:hover{color:#e1f860}@media (min-width: 780px) {.fwrd-hero-heading-main {transform: scale(1.8);}.mb-32{margin-bottom: 32px;}}
    </style>
  </head>
  <body class="wp-singular page-template page-template-page-fwrd-2026-awards page-template-page-fwrd-2026-awards-php page page-id-13449 page-parent wp-embed-responsive wp-theme-ataccama">
    <script>
      window.addEventListener(&#39;DOMContentLoaded&#39;, (event) =&gt; {
    window.onload = function() {
      setTimeout(function() {
        (function(w, d, s, l, i){w [l] = w[l] || [];w[l] . push({&#39;gtm.start&#39;:
              new Date() . getTime(),event:&#39;gtm.js&#39;});var f = d . getElementsByTagName(s)[0],
            j=d.createElement(s),dl = l != &#39;dataLayer&#39;?&#39;&amp;l=&#39;+l:&#39;&#39;;j . async = true;j . src =
            &#39;https://www.googletagmanager.com/gtm.js?id=&#39;+i+dl;f . parentNode . insertBefore(j,f);
        })(window, document, &#39;script&#39;, &#39;dataLayer&#39;, &#39;GTM-PDQCCZ8&#39;);
      }, 1500);
    };
  });
    </script>
    <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js" defer="">
    </script>
    <style>
      .fwrd-2026-hero-lottie,.fwrd-2026-hero-lottie-mobile{width:100%;min-width:0;min-height:0;overflow:hidden} .fwrd-2026-hero-lottie{aspect-ratio:16/9} .fwrd-2026-hero-shape-mobile,.fwrd-2026-hero-lottie-mobile{top:0;left:0;width:100%;height:100%;pointer-events:none} .fwrd-2026-hero-shape-mobile a{pointer-events:auto} .fwrd-2026-hero-content-mobile{pointer-events:none} .fwrd-2026-hero-content-mobile .btn{pointer-events:auto} .fwrd-2026-hero-loop-mobile{width:268px;height:268px;min-width:0;min-height:0;overflow:hidden;margin-left:auto;margin-right:auto} .fwrd-2026-hero-badge,.fwrd-2026-hero-cta .btn,.fwrd-2026-hero-badge-mobile,.fwrd-2026-hero-time-mobile,.fwrd-2026-hero-cta-mobile .btn,.fwrd-2026-hero-subtext,.fwrd-2026-hero-subtext-mobile,.fwrd-2026-hero-shape-mobile,.fwrd-2026-hero-loop-mobile{opacity:0}
    </style>
    <header class="position-relative overflow-hidden pt-md-96">
      <nav class="menu position-relative position-md-absolute top-0 bottom-0 left-0 right-0 py-32 py-md-0">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex">
                  <div class="d-flex">
                    <svg width="190" height="17" viewBox="0 0 190 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_40014631_4035)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84022 4.14393V5.57502C8.90377 4.39691 7.58595 3.80786 5.89053 3.80786C4.19511 3.80786 2.88862 4.42712 1.73316 5.66187C0.577713 6.89662 0 8.41079 0 10.2044C0 11.998 0.577713 13.5121 1.73316 14.7469C2.88862 15.9816 4.27441 16.6009 5.89053 16.6009C7.58595 16.6009 8.90377 16.0119 9.84022 14.8337V16.2648H12.9667V4.1477H9.84022V4.14393ZM8.8811 12.6626C8.24296 13.3007 7.4387 13.6179 6.47204 13.6179C5.50539 13.6179 4.70487 13.3007 4.07428 12.6626C3.44369 12.0244 3.13028 11.205 3.13028 10.2044C3.13028 9.20375 3.44369 8.38435 4.07428 7.74621C4.70487 7.10807 5.50539 6.79089 6.47204 6.79089C7.4387 6.79089 8.24674 7.11185 8.8811 7.74621C9.51924 8.38435 9.83644 9.20375 9.83644 10.2044C9.83644 11.205 9.51547 12.0282 8.8811 12.6626Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8965 1.41781L18.023 1.39893V4.14407H20.7606V7.14976H18.023V12.1907C18.023 12.6098 18.1287 12.9157 18.3364 13.112C18.5441 13.3046 18.8537 13.4141 19.2577 13.4405C19.6618 13.4632 20.164 13.4594 20.7606 13.4292V16.265C18.612 16.5066 17.0979 16.3065 16.2181 15.6608C15.3383 15.0151 14.8965 13.8597 14.8965 12.1945V1.42536V1.41781Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.186 4.14393V5.57502C30.2496 4.39691 28.9318 3.80786 27.2364 3.80786C25.541 3.80786 24.2345 4.42712 23.0828 5.66187C21.9273 6.89662 21.3496 8.41079 21.3496 10.2044C21.3496 11.998 21.9273 13.5121 23.0828 14.7469C24.2382 15.9816 25.624 16.6009 27.2364 16.6009C28.9318 16.6009 30.2496 16.0119 31.186 14.8337V16.2648H34.3126V4.1477H31.186V4.14393ZM30.2307 12.6626C29.5926 13.3007 28.7883 13.6179 27.8217 13.6179C26.855 13.6179 26.0545 13.3007 25.4239 12.6626C24.7933 12.0244 24.4799 11.205 24.4799 10.2044C24.4799 9.20375 24.7933 8.38435 25.4239 7.74621C26.0545 7.10807 26.855 6.79089 27.8217 6.79089C28.7883 6.79089 29.5964 7.11185 30.2307 7.74621C30.8689 8.38435 31.186 9.20375 31.186 10.2044C31.186 11.205 30.8651 12.0282 30.2307 12.6626Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M43.472 13.0741C42.9774 13.3573 42.4185 13.497 41.7879 13.497C40.8515 13.497 40.0736 13.1874 39.4619 12.5644C38.8464 11.9413 38.5406 11.1559 38.5406 10.2006C38.5406 9.24528 38.8464 8.43723 39.4619 7.81419C40.0774 7.19115 40.8515 6.88152 41.7879 6.88152C42.4034 6.88152 42.9547 7.02877 43.4456 7.31952C43.9365 7.61027 44.3065 8.00676 44.5482 8.50897L47.2367 6.93438C46.7345 5.98283 46.0019 5.22386 45.0315 4.65746C44.0611 4.09106 42.9887 3.80786 41.8106 3.80786C39.9868 3.80786 38.4613 4.42335 37.2454 5.65054C36.0258 6.87774 35.4141 8.39568 35.4141 10.2044C35.4141 12.0131 36.022 13.531 37.2454 14.7582C38.4651 15.9854 39.9868 16.6009 41.8106 16.6009C42.9887 16.6009 44.0649 16.3139 45.0315 15.74C45.9982 15.166 46.7533 14.4033 47.2858 13.448L44.5708 11.896C44.3292 12.3982 43.9591 12.7872 43.4682 13.0704L43.472 13.0741Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M54.0265 13.497C54.6571 13.497 55.2159 13.3573 55.7106 13.0741C56.2014 12.7909 56.5715 12.3982 56.8131 11.896L59.5281 13.448C58.9957 14.4033 58.2443 15.166 57.2738 15.74C56.3072 16.3139 55.231 16.6009 54.0529 16.6009C52.2291 16.6009 50.7074 15.9854 49.4877 14.7582C48.2681 13.531 47.6602 12.0131 47.6602 10.2044C47.6602 8.39568 48.2681 6.87774 49.4877 5.65054C50.7074 4.42335 52.2291 3.80786 54.0529 3.80786C55.231 3.80786 56.3072 4.09106 57.2738 4.65746C58.2443 5.22386 58.9768 5.98283 59.479 6.93438L56.7905 8.50897C56.5488 8.00676 56.1788 7.61027 55.6879 7.31952C55.197 7.02877 54.642 6.88152 54.0302 6.88152C53.0938 6.88152 52.316 7.19115 51.7042 7.81419C51.0888 8.43723 50.7829 9.24905 50.7829 10.2006C50.7829 11.1522 51.0888 11.9413 51.7042 12.5644C52.3197 13.1874 53.0938 13.497 54.0302 13.497H54.0265Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M69.772 4.14393V5.57502C68.8355 4.39691 67.5177 3.80786 65.8223 3.80786C64.1269 3.80786 62.8204 4.42712 61.6687 5.66187C60.5133 6.89662 59.9355 8.41079 59.9355 10.2044C59.9355 11.998 60.5133 13.5121 61.6687 14.7469C62.8242 15.9816 64.21 16.6009 65.8223 16.6009C67.5177 16.6009 68.8355 16.0119 69.772 14.8337V16.2648H72.8985V4.1477H69.772V4.14393ZM68.8167 12.6626C68.1785 13.3007 67.3742 13.6179 66.4076 13.6179C65.4409 13.6179 64.6404 13.3007 64.0098 12.6626C63.3792 12.0244 63.0658 11.205 63.0658 10.2044C63.0658 9.20375 63.3792 8.38435 64.0098 7.74621C64.6404 7.10807 65.4409 6.79089 66.4076 6.79089C67.3742 6.79089 68.1823 7.11185 68.8167 7.74621C69.4548 8.38435 69.772 9.20375 69.772 10.2044C69.772 11.205 69.451 12.0282 68.8167 12.6626Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M84.4085 5.54882C85.2165 4.38582 86.4173 3.80431 88.0183 3.80431C89.4078 3.80431 90.518 4.25742 91.3487 5.15988C92.1794 6.06612 92.5986 7.27444 92.5986 8.79616V16.2575H89.472V9.01139C89.472 8.2864 89.2946 7.72001 88.9396 7.31598C88.5847 6.91195 88.0825 6.71182 87.4368 6.71182C86.7269 6.71182 86.1719 6.94592 85.7791 7.41415C85.3827 7.88237 85.1863 8.56205 85.1863 9.44941V16.2575H82.0598V9.01139C82.0598 8.2864 81.8823 7.72001 81.5274 7.31598C81.1724 6.91195 80.6702 6.71182 80.0245 6.71182C79.3297 6.71182 78.7747 6.94592 78.3669 7.41415C77.9553 7.88237 77.7476 8.56205 77.7476 9.44941V16.2575H74.6211V4.14037H77.7476V5.42421C78.4726 4.3405 79.628 3.80054 81.1158 3.80054C82.6035 3.80054 83.6985 4.38204 84.4122 5.54504L84.4085 5.54882Z" fill="black">
                        </path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M103.772 4.14393V5.57502C102.835 4.39691 101.518 3.80786 99.8222 3.80786C98.1268 3.80786 96.8203 4.42712 95.6648 5.66187C94.5094 6.89662 93.9316 8.41079 93.9316 10.2044C93.9316 11.998 94.5094 13.5121 95.6648 14.7469C96.8203 15.9816 98.206 16.6009 99.8222 16.6009C101.518 16.6009 102.835 16.0119 103.772 14.8337V16.2648H106.898V4.1477H103.772V4.14393ZM102.817 12.6626C102.178 13.3007 101.374 13.6179 100.407 13.6179C99.4408 13.6179 98.6403 13.3007 98.0097 12.6626C97.3791 12.0244 97.0657 11.205 97.0657 10.2044C97.0657 9.20375 97.3791 8.38435 98.0097 7.74621C98.6403 7.10807 99.4408 6.79089 100.407 6.79089C101.374 6.79089 102.182 7.11185 102.817 7.74621C103.455 8.38435 103.772 9.20375 103.772 10.2044C103.772 11.205 103.451 12.0282 102.817 12.6626Z" fill="black">
                        </path>
                        <path d="M124.102 5.36192V6.59846H120.918V8.55722H123.358V9.77187H120.918V13H119.386V5.36192H124.102ZM135.398 5.36192L133.264 13H131.459L130.025 7.56143L128.526 13L126.732 13.0109L124.674 5.36192H126.316L127.662 11.2929L129.216 5.36192H130.923L132.389 11.2601L133.746 5.36192H135.398ZM140.338 13L138.653 10.0236H137.931V13H136.399V5.36192H139.266C139.856 5.36192 140.36 5.4677 140.776 5.67926C141.192 5.88353 141.502 6.16439 141.706 6.52186C141.917 6.87203 142.023 7.26597 142.023 7.70368C142.023 8.20705 141.877 8.663 141.585 9.07153C141.294 9.47277 140.86 9.74999 140.283 9.90319L142.111 13H140.338ZM137.931 8.87456H139.211C139.627 8.87456 139.937 8.77608 140.141 8.57911C140.345 8.37484 140.447 8.09397 140.447 7.73651C140.447 7.38634 140.345 7.11642 140.141 6.92674C139.937 6.72977 139.627 6.63129 139.211 6.63129H137.931V8.87456ZM146.079 5.36192C146.881 5.36192 147.585 5.51877 148.191 5.83246C148.804 6.14616 149.274 6.59481 149.602 7.17843C149.938 7.75475 150.106 8.42591 150.106 9.1919C150.106 9.9579 149.938 10.6291 149.602 11.2054C149.274 11.7744 148.804 12.2158 148.191 12.5295C147.585 12.8432 146.881 13 146.079 13H143.409V5.36192H146.079ZM146.024 11.6978C146.827 11.6978 147.447 11.4789 147.884 11.0412C148.322 10.6035 148.541 9.98708 148.541 9.1919C148.541 8.39673 148.322 7.77663 147.884 7.33163C147.447 6.87932 146.827 6.65317 146.024 6.65317H144.941V11.6978H146.024ZM154.166 11.271C154.867 10.6874 155.425 10.2023 155.841 9.81564C156.257 9.4217 156.603 9.01317 156.88 8.59005C157.157 8.16693 157.296 7.7511 157.296 7.34257C157.296 6.97051 157.209 6.67871 157.033 6.46714C156.858 6.25558 156.588 6.1498 156.224 6.1498C155.859 6.1498 155.578 6.27382 155.381 6.52186C155.184 6.7626 155.082 7.09453 155.075 7.51765H153.586C153.616 6.64223 153.875 5.97837 154.363 5.52606C154.859 5.07376 155.487 4.84761 156.246 4.84761C157.077 4.84761 157.716 5.07011 158.161 5.51512C158.606 5.95283 158.828 6.5328 158.828 7.25503C158.828 7.82405 158.675 8.36755 158.368 8.8855C158.062 9.40346 157.712 9.85577 157.318 10.2424C156.924 10.6218 156.41 11.0814 155.775 11.6212H159.003V12.8906H153.597V11.7525L154.166 11.271ZM159.969 8.90739C159.969 7.64532 160.195 6.65682 160.647 5.94189C161.107 5.22696 161.865 4.86949 162.923 4.86949C163.981 4.86949 164.736 5.22696 165.188 5.94189C165.648 6.65682 165.878 7.64532 165.878 8.90739C165.878 10.1768 165.648 11.1726 165.188 11.8948C164.736 12.617 163.981 12.9781 162.923 12.9781C161.865 12.9781 161.107 12.617 160.647 11.8948C160.195 11.1726 159.969 10.1768 159.969 8.90739ZM164.368 8.90739C164.368 8.36755 164.331 7.91524 164.258 7.55048C164.192 7.17843 164.054 6.87568 163.842 6.64223C163.638 6.40878 163.332 6.29206 162.923 6.29206C162.515 6.29206 162.204 6.40878 161.993 6.64223C161.789 6.87568 161.65 7.17843 161.577 7.55048C161.511 7.91524 161.479 8.36755 161.479 8.90739C161.479 9.46183 161.511 9.92872 161.577 10.3081C161.643 10.6801 161.781 10.9829 161.993 11.2163C162.204 11.4425 162.515 11.5555 162.923 11.5555C163.332 11.5555 163.642 11.4425 163.853 11.2163C164.065 10.9829 164.203 10.6801 164.269 10.3081C164.335 9.92872 164.368 9.46183 164.368 8.90739ZM167.524 11.271C168.225 10.6874 168.783 10.2023 169.199 9.81564C169.614 9.4217 169.961 9.01317 170.238 8.59005C170.515 8.16693 170.654 7.7511 170.654 7.34257C170.654 6.97051 170.566 6.67871 170.391 6.46714C170.216 6.25558 169.946 6.1498 169.582 6.1498C169.217 6.1498 168.936 6.27382 168.739 6.52186C168.542 6.7626 168.44 7.09453 168.433 7.51765H166.944C166.974 6.64223 167.233 5.97837 167.721 5.52606C168.217 5.07376 168.845 4.84761 169.603 4.84761C170.435 4.84761 171.073 5.07011 171.518 5.51512C171.963 5.95283 172.186 6.5328 172.186 7.25503C172.186 7.82405 172.033 8.36755 171.726 8.8855C171.42 9.40346 171.07 9.85577 170.676 10.2424C170.282 10.6218 169.768 11.0814 169.133 11.6212H172.361V12.8906H166.955V11.7525L167.524 11.271ZM177.463 7.01428C177.39 6.70789 177.262 6.47809 177.08 6.32489C176.905 6.17169 176.649 6.09509 176.314 6.09509C175.81 6.09509 175.438 6.29935 175.198 6.70789C174.964 7.10912 174.844 7.76569 174.837 8.67759C175.012 8.38578 175.267 8.15963 175.603 7.99914C175.938 7.83135 176.303 7.74745 176.697 7.74745C177.171 7.74745 177.59 7.84959 177.955 8.05385C178.32 8.25812 178.605 8.55722 178.809 8.95116C179.013 9.33781 179.115 9.8047 179.115 10.3518C179.115 10.8698 179.009 11.333 178.798 11.7416C178.594 12.1428 178.291 12.4565 177.89 12.6827C177.488 12.9088 177.011 13.0219 176.456 13.0219C175.697 13.0219 175.099 12.8541 174.661 12.5185C174.231 12.1829 173.928 11.716 173.753 11.1178C173.585 10.5123 173.502 9.76822 173.502 8.8855C173.502 7.55048 173.731 6.54374 174.191 5.86529C174.651 5.17954 175.376 4.83667 176.369 4.83667C177.135 4.83667 177.729 5.04458 178.152 5.46041C178.575 5.87623 178.82 6.39419 178.885 7.01428H177.463ZM176.347 9.00588C175.96 9.00588 175.635 9.11895 175.373 9.3451C175.11 9.57125 174.979 9.89954 174.979 10.33C174.979 10.7604 175.099 11.0996 175.34 11.3476C175.588 11.5957 175.934 11.7197 176.379 11.7197C176.773 11.7197 177.083 11.5993 177.31 11.3586C177.543 11.1178 177.66 10.7932 177.66 10.3847C177.66 9.96155 177.547 9.62597 177.321 9.37793C177.102 9.12989 176.777 9.00588 176.347 9.00588Z" fill="#F655B5">
                        </path>
                      </g>
                      <defs>
                        <clipPath id="clip0_40014631_4035">
                          <rect width="189.67" height="17" fill="white">
                          </rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div class="d-none d-sm-flex">
                  <a class="btn bg-pink-70 text-white px-24" href="#registration">                  <span>                  Register now
</span>
</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="module-animations gsap-fwrd-26">
      <div class="fwrd-2026-intro-pinner">
        <header class="overflow-hidden">
          <div class="container">
            <div class="row mb-48 mb-sm-8">
              <div class="col-12">
                <div class="position-relative d-none d-sm-flex flex-column">
                  <div class="fwrd-2026-hero-lottie block-16-9" data-lottie-intro-src="/dist/images/other/animations/lottie/FWRD26-hero-intro-2.json" data-lottie-loop-src="/dist/images/other/animations/lottie/FWRD26-hero-loop-2.json">
                  </div>
                  <div class="fwrd-2026-hero-time-container">
                    <div class="d-flex align-items-center gap-16">
                      <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14775 0.175633L17.283 8.33681C18.239 8.85239 18.239 10.1413 17.283 10.6569L2.14775 18.8181C1.1917 19.3337 0 18.6923 0 17.6612V1.33882C0 0.307671 1.1917 -0.333654 2.14775 0.181921V0.175633Z" fill="#F10090">
                        </path>
                      </svg>
                      <span class="fw-semibold">                      NOV 5 · 10 AM ET · VIRTUAL
</span>
                    </div>
                  </div>
                  <div class="fwrd-2026-hero-absolute-container">
                    <div class="d-flex flex-column">
                      <div class="fwrd-2026-hero-badge d-flex align-items-center gap-24 mb-16 ">
                        <div class="d-flex">
                          <svg class="menu-logo text-white" style="width: 180px; height: 30px;">
                            <use href="https://www.ataccama.com/wp-content/themes/ataccama/dist/images/icons/icon-sprite.svg?v=20241219#ata-logo">
                            </use>
                          </svg>
                        </div>
                        <span class="fs-21 fw-semibold text-pink-30">                        FWRD 2026
</span>
                      </div>
                      <h1 class="fwrd-2026-hero-headline text-white fw-semibold lh-120 mb-16 ">
                        Press play on
                        <br class="d-none d-sm-flex" />
                        what’s next
                        <br class="d-none d-sm-flex" />
                        in data trust
                      </h1>
                      <p class="fwrd-2026-hero-subtext text-white lh-130 mb-16 ">
                        Join hundreds of data leaders at our biggest event of the year. Learn firsthand how top orgs accelerated AI with trusted data in 2026, and what 2027 asks of them.
                      </p>
                      <div class="fwrd-2026-hero-cta d-flex">
                        <a class="fwrd-link-correction btn bg-white fw-semibold text-pink-70 btn-bg-behind-navy" href="#registration">                        <span>                        Register now
</span>
</a>
                      </div>
                    </div>
                  </div>
                  <a class="d-none d-md-flex fwrd-hero-play-btn-cover" href="#registration"></a>
                </div>
                <div class="position-relative d-flex d-sm-none flex-column phone-fullwidth mt-16">
                  <div class="fwrd-2026-hero-shape-mobile position-absolute">
                    <svg width="393" height="728" viewBox="0 0 393 728" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-100 h-100" preserveAspectRatio="xMaxYMin slice">
                      <path class="fwrd-2026-hero-shape-fill" d="M0 727.5V0H292.917C303.963 0 312.917 8.95431 312.917 20V54C312.917 65.0457 321.871 74 332.917 74H393V727.5H0Z" fill="#F655B5">
                      </path>
                      <a href="#registration">                      <path d="M354 60C368.359 60 380 48.3594 380 34C380 19.6406 368.359 8 354 8C339.641 8 328 19.6406 328 34C328 48.3594 339.641 60 354 60Z" fill="#D1F84C">
                      </path>
</a>
                      <path d="M347.644 22.1267L365.446 32.4054C366.572 33.0535 366.572 34.678 365.446 35.3262L347.644 45.6048C346.518 46.253 345.113 45.4428 345.113 44.1424V23.585C345.113 22.2846 346.518 21.4745 347.644 22.1226V22.1267Z" fill="black">
                      </path>
                    </svg>
                  </div>
                  <div class="fwrd-2026-hero-lottie-mobile position-absolute" data-lottie-intro-src="/dist/images/other/animations/lottie/FWRD26-hero-phone-intro-1.json">
                  </div>
                  <div class="fwrd-2026-hero-content-mobile position-relative w-100 px-24 py-32">
                    <div class="fwrd-2026-hero-badge-mobile d-flex align-items-center gap-16 mb-24">
                      <div class="d-flex">
                        <svg class="menu-logo text-white" style="width: 120px; height: 18px;">
                          <use href="https://www.ataccama.com/wp-content/themes/ataccama/dist/images/icons/icon-sprite.svg?v=20241219#ata-logo">
                          </use>
                        </svg>
                      </div>
                      <span class="fs-12 fw-semibold text-pink-30">                      FWRD 2026
</span>
                    </div>
                    <span class="fwrd-2026-hero-time-mobile d-flex fs-12 fw-medium text-white mb-8">                    NOV 5 · 10 AM ET · VIRTUAL
</span>
                    <h2 class="fwrd-2026-hero-headline-mobile fs-44 text-white fw-semibold lh-120 mb-16 pt-8">
                      Press play on
                      <br />
                      what’s next
                      <br />
                      in data trust
                    </h2>
                    <p class="fwrd-2026-hero-subtext-mobile fs-14 text-white lh-150 mb-16 ">
                      Join hundreds of data leaders at our biggest event of the year. Learn firsthand how top orgs accelerated AI with trusted data in 2026, and what 2027 asks of them.
                    </p>
                    <div class="fwrd-2026-hero-cta-mobile d-flex">
                      <a class="btn bg-white fw-semibold text-pink-70 btn-bg-behind-navy" href="#registration">                      <span>                      Register now
</span>
</a>
                    </div>
                    <div class="fwrd-2026-hero-loop-mobile mt-16" data-lottie-loop-src="/dist/images/other/animations/lottie/FWRD26-diamond-arrow-loop.json">
                      <svg width="268" height="268" viewBox="0 0 268 268" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-100 h-100">
                        <path d="M124.994 4.79394L4.79394 124.994C-0.264647 130.053 -0.264646 138.254 4.79394 143.313L123.962 262.481C129.02 267.539 137.222 267.539 142.281 262.481L262.481 142.281C267.539 137.222 267.539 129.02 262.481 123.962L143.313 4.79394C138.254 -0.264645 130.053 -0.26465 124.994 4.79394Z" fill="#1A0C42">
                        </path>
                        <path d="M127.977 103.811V155.185L85.1661 180.88V78.4794L127.977 103.811Z" fill="white">
                        </path>
                        <path d="M207.635 133.077L127.978 180.88V155.185L163.343 133.961C166.838 131.861 166.822 126.792 163.316 124.714L127.978 103.811V78.4794L207.608 125.593C210.446 127.275 210.463 131.378 207.63 133.077H207.635Z" fill="white">
                        </path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="d-flex flex-column align-items-center text-black text-center">
                  <span class="mb-24">                  You&#39;re joining speakers and attendees from:
</span>
                  <div class="d-flex logo-carousel-container">
                    <div class="module-components logo-carousel d-flex justify-content-center gap-40 w-100 pe-40 pe-md-0" data-static-limit="8" data-animate-below="md">
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/dist/ata/images/other/logos/lennar.svg" alt="Lennar" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/assets/2025/11/client_logo_mondelez.png" alt="Mondelez" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/assets/2026/03/Lloyds_logo.png" alt="Lloyds" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/files/companies/919-company.jpg" alt="iA Financial Group" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/dist/ata/images/other/logos/servicenow.svg" alt="servicenow" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/dist/ata/images/other/logos/snowflake-black.svg" alt="Snowflake" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                      <div class="logo-carousel-slide d-flex justify-content-center align-items-center mx-16">
                        <img src="https://cdn.ataccama.com/assets/2026/06/company-logo-deloitte-com.png" alt="Deloitte" class="w-10 h-100 object-fit-contain black-logo-filter img-85-35" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section class="bg-white overflow-hidden py-56 py-sm-120">
          <div class="container">
            <div class="row justify-content-center mb-48">
              <div class="col-12 col-sm-8">
                <div class="d-flex flex-column align-items-center text-center">
                  <div class="d-flex align-items-center mb-8">
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.07387 0.0924387L8.64148 4.3878C9.11951 4.65915 9.11951 5.33754 8.64148 5.60889L1.07387 9.90425C0.595848 10.1756 0 9.83807 0 9.29536V0.704643C0 0.161932 0.595848 -0.175607 1.07387 0.0957479V0.0924387Z" fill="#6A2CF5">
                      </path>
                    </svg>
                    <span class="fs-12 text-black fw-medium text-uppercase ms-4">                    Featured speakers
</span>
                  </div>
                  <h2 class="fs-44 fw-semibold text-navy mb-16">
                    Hear from the leaders moving data and AI FWRD
                  </h2>
                  <p class="fs-16 text-navy-70 mb-16">
                    Get an inside look at how data and AI strategies are evolving from the people building, leading, and putting them into practice.
                  </p>
                  <div class="d-flex">
                    <a class="btn bg-purple text-white px-24" href="#registration">                    <span>                    Register now
</span>
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-12">
                <div class="module-swipers universal-swiper overflow-visible swiper h-100" data-breakpoints="{&#34;800&#34;: {&#34;slidesPerView&#34;: 2}, &#34;1000&#34;: {&#34;slidesPerView&#34;: 3}, &#34;1200&#34;: {&#34;slidesPerView&#34;: 3.6}}" data-initial-slide="0" data-navigation-next-el="universal-swiper-provision-arrow-right" data-navigation-prev-el="universal-swiper-provision-arrow-left" data-pagination-element="swiper-pagination-provision">
                  <ul class="swiper-wrapper list-unstyled d-flex m-0">
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/08/isaac-gabay.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/08/isaac-gabay.webp" alt="Isaac Gabay" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Isaac Gabay
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                VP of Data &amp; AI
                              </p>
                              <p class="fs-14 text-black m-0">
                                Lennar
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Isaac
                                <br class="d-flex" />
                                Gabay
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                VP of Data &amp; AI, Lennar
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Isaac Gabay is VP of Data &amp; AI at Lennar, where he leads enterprise data initiatives supporting the company’s modernization and AI ambitions. His work focuses on improving data quality, governance, and accessibility to help Lennar operate more efficiently and put trusted data to work at scale.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/08/camilla-bjorkqvist.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/08/camilla-bjorkqvist.webp" alt="Camilla Björkqvist" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Camilla Björkqvist
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Senior Director Global Data Governance &amp; Transformation
                              </p>
                              <p class="fs-14 text-black m-0">
                                Mondelēz International
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Camilla
                                <br class="d-flex" />
                                Björkqvist
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Senior Director Global Data Governance &amp; Transformation, Mondelēz International
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Camilla Björkqvist is Senior Director of Global Data Governance &amp; Transformation at Mondelēz International. She leads work to strengthen how data is governed and used across the business, with a focus on turning data into a foundation for business impact, innovation, and transformation.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/09/chantale-fwrd.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/09/chantale-fwrd.webp" alt="Chantale Boulanger" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Chantale Boulanger
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Senior Director, IT Delivery for Dealer Services
                              </p>
                              <p class="fs-14 text-black m-0">
                                iA Financial Group
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Chantale
                                <br class="d-flex" />
                                Boulanger
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Senior Director, IT Delivery for Dealer Services, iA Financial Group
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Chantale Boulanger is Senior Director, IT Delivery for Dealer Services and Auto Financing at iA Financial Group, following several years leading the company&#39;s client data strategy as Senior Director of Performance and Shared Client Data. In that role, she built the organization&#39;s master data management (MDM) foundation and 360-degree client view, aligning teams around a single, centralized picture of the customer. A results-driven leader with a Bachelor&#39;s in Business Administration (and currently pursuing an EMBA), she&#39;s driven digital transformation, performance analytics, and AI deployment throughout her career.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/09/nickolaos-fwrd.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/09/nickolaos-fwrd.webp" alt="Nickolaos Mikedis" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Nickolaos Mikedis
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Leader, Strategy and Data Trust
                              </p>
                              <p class="fs-14 text-black m-0">
                                iA Financial Group
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Nickolaos
                                <br class="d-flex" />
                                Mikedis
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Leader, Strategy and Data Trust, iA Financial Group
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Nickolaos Mikedis is Leader, Strategy and Data Trust at iA Financial Group (Industrial Alliance), where he partners with business stakeholders to shape how data trust priorities translate into technology strategy. His path there runs through product ownership and 15+ years of IT project leadership on complex, multi-platform systems, experience that gives him both a leader and practitioner view of what it takes to operationalize trust at scale.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/09/jo-3-fwrd.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/09/jo-3-fwrd.webp" alt="Jo Riseborough" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Jo Riseborough
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Group Data Management and Data Culture Director
                              </p>
                              <p class="fs-14 text-black m-0">
                                Lloyds Banking Group
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Jo
                                <br class="d-flex" />
                                Riseborough
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Group Data Management and Data Culture Director, Lloyds Banking Group
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Jo Riseborough is Group Data Management and Data Culture Director at Lloyds Banking Group, where she leads a large, data-literate team shaping the group&#39;s data strategy and a mandate to make LBG one of the most data-literate financial institutions in the world. Her focus spans data quality, metadata management, and data products, built on the belief that AI&#39;s success depends on the data discipline behind it. Before LBG, she spent nearly 15 years at Aviva across audit, governance, underwriting, and financial crime prevention, building deep expertise in data privacy, governance, and risk.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/09/Vector-1-2.png" />
                                  <img src="https://cdn.ataccama.com/assets/2026/09/Vector-1-2.png" alt="Juan Sequeda" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Juan Sequeda
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Principal Data Strategist &amp; Researcher
                              </p>
                              <p class="fs-14 text-black m-0">
                                ServiceNow
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Juan
                                <br class="d-flex" />
                                Sequeda
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Principal Data Strategist &amp; Researcher, ServiceNow
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Juan Sequeda is Principal Data Strategist &amp; Researcher at ServiceNow (following its acquisition of data.world), and co-host of Catalog &amp; Cocktails, the honest, no-bs data podcast. With 20 years working in knowledge graphs and ontologies, he holds a PhD in Computer Science from UT Austin and pioneered technology for building knowledge graphs from relational databases, work that led to W3C standards, patents, and the acquisition of his own startup, Capsenta, by data.world in 2019.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/10/FWRD-2026_Chris.jpg" />
                                  <img src="https://cdn.ataccama.com/assets/2026/10/FWRD-2026_Chris.jpg" alt="Chris Child" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Chris Child
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                VP Product Management
                              </p>
                              <p class="fs-14 text-black m-0">
                                Snowflake
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Chris
                                <br class="d-flex" />
                                Child
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                VP Product Management, Snowflake
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Chris Child is VP of Product, Data Engineering at Snowflake, where he oversees data engineering, open lakehouse, open source, and developer products. Since joining Snowflake in 2018, he&#39;s held several product leadership roles, including VP of Worldwide Sales Engineering, giving him a ground-level view of how customers put Snowflake&#39;s platform to work. Before Snowflake, he led product teams at Segment, Salesforce, RelateIQ, and Foursquare, and spent time as a technology investor. He&#39;s an alum of MIT and Stanford.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/10/FWRD-2026_Donovan.jpg" />
                                  <img src="https://cdn.ataccama.com/assets/2026/10/FWRD-2026_Donovan.jpg" alt="Donovan Spronk" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Donovan Spronk
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Partner, Ecosystem &amp; Alliance Leader
                              </p>
                              <p class="fs-14 text-black m-0">
                                Deloitte
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Donovan
                                <br class="d-flex" />
                                Spronk
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Partner, Ecosystem &amp; Alliance Leader, Deloitte
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Donovan Spronk is Partner and Growth Platforms Leader (Ecosystems &amp; Alliances, Technology Relationships) at Deloitte Central Europe, where he also serves as AWS Alliance Leader. A South African based in Prague, he brings 13+ years of experience across public sector, manufacturing, telco, and retail, with deep expertise in AI and data — spanning large-scale analytics engagements, M&amp;A analytics, forensic analytics, and cloud-driven analytical product development.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/09/peter-fwrd.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/09/peter-fwrd.webp" alt="Peter Stojanovic" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Peter Stojanovic
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Editor
                              </p>
                              <p class="fs-14 text-black m-0">
                                HotTopics
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Peter
                                <br class="d-flex" />
                                Stojanovic
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Editor, HotTopics
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Peter Stojanovic is Editor of HotTopics and its C-suite event series, The Studio, and a highly experienced journalist and moderator who regularly interviews FTSE 100 and Fortune 500 executives. A sought-after keynote speaker, emcee, and panellist on AI, technology, innovation, and business strategy, he brings sharp interviewing instincts and a genuine curiosity about what&#39;s shaping the C-suite agenda — making him a natural fit to moderate our second session.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/08/martin-zahumensky.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/08/martin-zahumensky.webp" alt="Martin Zahumensky" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Martin Zahumensky
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                CEO
                              </p>
                              <p class="fs-14 text-black m-0">
                                Ataccama
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Martin
                                <br class="d-flex" />
                                Zahumensky
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                CEO, Ataccama
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Martin Zahumensky is CEO of Ataccama, bringing more than two decades of experience in data management, technology, and AI. A longtime company builder and former CTO, he leads Ataccama’s strategy to help enterprises put AI to work with data they can trust.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/09/FWRD-2026_Jay.jpg" />
                                  <img src="https://cdn.ataccama.com/assets/2026/09/FWRD-2026_Jay.jpg" alt="Jay Limburn" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Jay Limburn
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                President
                              </p>
                              <p class="fs-14 text-black m-0">
                                Ataccama
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Jay
                                <br class="d-flex" />
                                Limburn
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                President, Ataccama
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Jay Limburn is President of Ataccama, an AI data management company. With 20+ years in tech and formerly VP of Product Management for IBM watsonx, he holds 17 patents in AI and data governance. Today, he empowers enterprises with trusted data architectures to drive safe, effective AI innovation.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex justify-content-center h-100">
                      <div class="fwrd-2026-flip-card w-100 h-100">
                        <div class="fwrd-2026-flip-card-inner position-relative w-100 h-100">
                          <div class="fwrd-2026-flip-card-front position-relative d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                                  </path>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column">
                              <div class="d-flex mb-40">
                                <picture>
                                  <source type="image/jpg" srcset="https://cdn.ataccama.com/assets/2026/08/jessica-smith.webp" />
                                  <img src="https://cdn.ataccama.com/assets/2026/08/jessica-smith.webp" alt="Jessica Smith" class="img-mw-267 object-fit-cover w-100" />
                                </picture>
                              </div>
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Jessica Smith
                              </h3>
                              <p class="fs-14 mb-8 text-black ">
                                Chief Product Officer
                              </p>
                              <p class="fs-14 text-black m-0">
                                Ataccama
                              </p>
                            </div>
                          </div>
                          <div class="fwrd-2026-flip-card-back position-absolute top-0 left-0 d-flex w-100 h-100 bg-purple-40 rounded-24 p-24">
                            <div class="position-absolute top-0 right-0 p-24">
                              <div class="fwrd-2026-flip-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                                <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                                  </line>
                                </svg>
                              </div>
                            </div>
                            <div class="d-flex flex-column h-100">
                              <h3 class="fs-24 fw-semibold text-black mb-0">
                                Jessica
                                <br class="d-flex" />
                                Smith
                              </h3>
                              <p class="fs-14 text-black mb-16">
                                Chief Product Officer, Ataccama
                              </p>
                              <div class="fwrd-2026-flip-card-back-bio-wrap flex-grow-1 border-top border-navy border-opacity-10 pt-16">
                                <p class="fwrd-2026-flip-card-back-bio fs-14 text-black m-0">
                                  Jessica Smith is Chief Product Officer at Ataccama, bringing more than a decade of experience across enterprise data management, AI, and product development. She leads Ataccama’s product strategy, focused on helping enterprises improve data quality and build the trusted data foundation needed for AI.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="universal-swiper-buttons-container d-none d-sm-flex justify-content-center mt-80">
                  <div class="d-flex gap-24">
                    <div class="universal-swiper-provision-arrow-left btn btn-hoverable d-flex border border-purple-60 cursor-pointer p-12">
                      <svg class="icon icon-24">
                        <use href="https://www.ataccama.com/wp-content/themes/ataccama/dist/images/icons/icon-sprite.svg?v=20241122#icon-arrow-back">
                        </use>
                      </svg>
                    </div>
                    <div class="universal-swiper-provision-arrow-right btn btn-hoverable d-flex border border-purple-60 cursor-pointer p-12">
                      <svg class="icon icon-24">
                        <use href="https://www.ataccama.com/wp-content/themes/ataccama/dist/images/icons/icon-sprite.svg?v=20241122#icon-arrow-forward">
                        </use>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="position-relative d-flex d-sm-none mt-24">
                  <div class="swiper-pagination-provision d-flex justify-content-center gap-8">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="pb-56 pb-sm-120">
          <div class="container">
            <div class="row justify-content-center mb-48">
              <div class="col-12 col-sm-8">
                <div class="d-flex flex-column align-items-center text-center">
                  <div class="d-flex align-items-center mb-8">
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.07387 0.0924387L8.64148 4.3878C9.11951 4.65915 9.11951 5.33754 8.64148 5.60889L1.07387 9.90425C0.595848 10.1756 0 9.83807 0 9.29536V0.704643C0 0.161932 0.595848 -0.175607 1.07387 0.0957479V0.0924387Z" fill="#6A2CF5">
                      </path>
                    </svg>
                    <span class="fs-12 text-black fw-medium text-uppercase ms-4">                    Event highlights
</span>
                  </div>
                  <h2 class="fs-44 fw-semibold text-navy mb-16">
                    Event highlights
                  </h2>
                  <p class="fs-16 text-navy-70 mb-16">
                    See how leading organizations are building trusted data for AI, managing data at AI speed, and staying ahead of governance and regulatory demands.
                  </p>
                </div>
              </div>
            </div>
            <div class="row justify-content-center mb-56 mb-sm-120">
              <div class="col-12 col-md-10">
                <div class="row justify-content-center row-gap-24">
                  <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center justify-content-sm-end justify-content-md-center">
                    <div class="fwrd-2026-zoom-card position-relative d-flex bg-purple-40 rounded-24 overflow-hidden p-24">
                      <div class="position-relative d-flex w-100 z-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="267" height="270" viewBox="0 0 267 270" fill="none" class="w-100 h-100">
                          <g class="fwrd-background">
                            <path d="M0.378281 53.7086L1.18764e-05 262.373C-0.00715231 266.583 3.22784 270 7.22116 270H155.603C159.591 270 162.824 266.591 162.824 262.386V228.042C162.824 223.837 166.057 220.429 170.046 220.429H259.779C263.767 220.429 267 217.02 267 212.815V9.81707C267 4.39529 262.831 0 257.689 0H59.0059C55.0176 0 51.7844 3.40882 51.7844 7.61338V38.4954C51.7844 42.7003 48.5512 46.1092 44.5629 46.1092H7.59942C3.61649 46.1092 0.385445 49.5089 0.378281 53.7086Z" fill="#1A0C42">
                            </path>
                          </g>
                          <g class="fwrd-icon">
                            <g transform="translate(7 7)">
                              <path d="M15.5 31C24.0604 31 31 24.0604 31 15.5C31 6.93959 24.0604 0 15.5 0C6.93959 0 0 6.93959 0 15.5C0 24.0604 6.93959 31 15.5 31Z" fill="#D1F84C">
                              </path>
                              <path d="M11.6375 8.14582L22.5269 14.7022C23.2147 15.1165 23.2147 16.1518 22.5269 16.5657L11.6375 23.1221C10.9497 23.5364 10.0898 23.0185 10.0898 22.1903V9.0776C10.0898 8.24939 10.9497 7.73152 11.6375 8.14582Z" fill="black">
                              </path>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div class="fwrd-2026-zoom-card-title d-flex justify-content-center align-items-center position-absolute top-0 bottom-0 left-0 right-0 z-2">
                        <h3 class="fs-32 fw-semibold text-purple-40">
                          Live demos
                        </h3>
                      </div>
                      <div class="fwrd-2026-zoom-card-text d-flex position-absolute top-0 bottom-0 left-0 right-0 z-2 p-24 pt-80">
                        <p class="fs-14 m-0 text-white">
                          Enjoy live demos of shift-left data quality, AI agents grounded in quality scores and governed context, automating data management, reusable rules, and Master Data Management for AI.
                        </p>
                      </div>
                      <div class="position-absolute bottom-0 right-0 z-2 p-24">
                        <div class="fwrd-2026-zoom-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                          <svg class="fwrd-2026-zoom-card-toggle-plus" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                            </path>
                          </svg>
                          <svg class="fwrd-2026-zoom-card-toggle-minus" width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                            </line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center justify-content-sm-start justify-content-md-center">
                    <div class="fwrd-2026-zoom-card position-relative d-flex bg-pink-20 rounded-24 overflow-hidden p-24">
                      <div class="position-relative d-flex w-100 z-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="267" height="270" viewBox="0 0 267 270" fill="none" class="w-100 h-100">
                          <g class="fwrd-background">
                            <path d="M0.378281 53.7086L1.18764e-05 262.373C-0.00715231 266.583 3.22784 270 7.22116 270H155.603C159.591 270 162.824 266.591 162.824 262.386V228.042C162.824 223.837 166.057 220.429 170.046 220.429H259.779C263.767 220.429 267 217.02 267 212.815V9.81707C267 4.39529 262.831 0 257.689 0H59.0059C55.0176 0 51.7844 3.40882 51.7844 7.61338V38.4954C51.7844 42.7003 48.5512 46.1092 44.5629 46.1092H7.59942C3.61649 46.1092 0.385445 49.5089 0.378281 53.7086Z" fill="#33012A">
                            </path>
                          </g>
                          <g class="fwrd-icon">
                            <g transform="translate(7 7)">
                              <path d="M15.5 31C24.0604 31 31 24.0604 31 15.5C31 6.93959 24.0604 0 15.5 0C6.93959 0 0 6.93959 0 15.5C0 24.0604 6.93959 31 15.5 31Z" fill="#F655B5">
                              </path>
                              <path d="M23.8313 15.1007C23.8313 20.1768 21.5642 22.7149 17.027 22.7149V19.885C19.1386 19.885 20.1934 18.6729 20.1934 16.2471V14.6967H16.8921V8.90234H23.0233C23.5619 11.2831 23.8313 13.3501 23.8313 15.1007ZM14.7342 15.1007C14.7342 20.1768 12.4429 22.7149 7.86238 22.7149V19.885C10.0188 19.885 11.0963 18.6729 11.0963 16.2471V14.6967H7.79492V8.90234H13.9262C14.4647 11.2831 14.7342 13.3501 14.7342 15.1007Z" fill="black">
                              </path>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div class="fwrd-2026-zoom-card-title d-flex justify-content-center align-items-center position-absolute top-0 bottom-0 left-0 right-0 z-2">
                        <h3 class="fs-32 fw-semibold text-pink-20">
                          Data leaders
                        </h3>
                      </div>
                      <div class="fwrd-2026-zoom-card-text d-flex position-absolute top-0 bottom-0 left-0 right-0 z-2 p-24 pt-80">
                        <p class="fs-14 m-0 text-white">
                          Hear from data leaders at Lennar, Mondelēz and more on bringing AI agents into production, modernizing data environments, and leading the organizational change that comes with AI and analytics.
                        </p>
                      </div>
                      <div class="position-absolute bottom-0 right-0 z-2 p-24">
                        <div class="fwrd-2026-zoom-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                          <svg class="fwrd-2026-zoom-card-toggle-plus" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                            </path>
                          </svg>
                          <svg class="fwrd-2026-zoom-card-toggle-minus" width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                            </line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                    <div class="fwrd-2026-zoom-card position-relative d-flex bg-purple-10 rounded-24 overflow-hidden p-24">
                      <div class="position-relative d-flex w-100 z-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="267" height="270" viewBox="0 0 267 270" fill="none" class="w-100 h-100">
                          <g class="fwrd-background">
                            <path d="M0.378281 53.7086L1.18764e-05 262.373C-0.00715231 266.583 3.22784 270 7.22116 270H155.603C159.591 270 162.824 266.591 162.824 262.386V228.042C162.824 223.837 166.057 220.429 170.046 220.429H259.779C263.767 220.429 267 217.02 267 212.815V9.81707C267 4.39529 262.831 0 257.689 0H59.0059C55.0176 0 51.7844 3.40882 51.7844 7.61338V38.4954C51.7844 42.7003 48.5512 46.1092 44.5629 46.1092H7.59942C3.61649 46.1092 0.385445 49.5089 0.378281 53.7086Z" fill="#D1F84C">
                            </path>
                          </g>
                          <g class="fwrd-icon">
                            <g transform="translate(7 7)">
                              <path d="M15.5 31C24.0604 31 31 24.0604 31 15.5C31 6.93959 24.0604 0 15.5 0C6.93959 0 0 6.93959 0 15.5C0 24.0604 6.93959 31 15.5 31Z" fill="#1A0C42">
                              </path>
                              <path d="M8.11395 8.13616L18.7275 14.2583C19.3979 14.6452 19.3979 15.612 18.7275 15.9984L8.11395 22.1206C7.44359 22.5075 6.60547 22.0239 6.60547 21.2505V9.00623C6.60547 8.23288 7.44359 7.7493 8.11395 8.13616Z" fill="white">
                              </path>
                              <path d="M16.2956 8.13616L26.9091 14.2583C27.5795 14.6452 27.5795 15.612 26.9091 15.9984L16.2956 22.1206C15.6252 22.5075 14.7871 22.0239 14.7871 21.2505V9.00623C14.7871 8.23288 15.6252 7.7493 16.2956 8.13616Z" fill="white">
                              </path>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div class="fwrd-2026-zoom-card-title d-flex justify-content-center align-items-center position-absolute top-0 bottom-0 left-0 right-0 z-2">
                        <h3 class="fs-32 fw-semibold text-navy">
                          AI in 2027
                        </h3>
                      </div>
                      <div class="fwrd-2026-zoom-card-text d-flex position-absolute top-0 bottom-0 left-0 right-0 z-2 p-24 pt-80">
                        <p class="fs-14 m-0 text-black">
                          See what to expect in 2027: how data managment teams will partner with the business on AI, why trust, context, and semantic layers will matter more; how AI will change data issue detection and remediation; and where AI governance and regulation are headed.
                        </p>
                      </div>
                      <div class="position-absolute bottom-0 right-0 z-2 p-24">
                        <div class="fwrd-2026-zoom-card-toggle d-flex justify-content-center align-items-center bg-white block-37 rounded-circle cursor-pointer">
                          <svg class="fwrd-2026-zoom-card-toggle-plus" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 6.2506H11.5012M6.2506 1V11.5012" stroke="#1A0C42" stroke-width="2" stroke-linecap="round">
                            </path>
                          </svg>
                          <svg class="fwrd-2026-zoom-card-toggle-minus" width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="1" x2="12" y2="1" stroke="#1A0C42" stroke-width="2">
                            </line>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-12 col-md-10">
                <div class="d-flex bg-navy rounded-16">
                  <div class="row">
                    <div class="col-12 col-sm-4 pe-0">
                      <div class="d-flex align-items-center h-100 mt-40 mt-sm-0">
                        <svg width="294" height="238" viewBox="0 0 294 238" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-100 h-100" style="max-width: 294px;">
                          <mask id="mask0_2856_9968" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="294" height="238">
                            <rect width="294" height="238" fill="#A01C1C">
                            </rect>
                          </mask>
                          <g mask="url(#mask0_2856_9968)">
                            <path d="M-71.002 238L131.327 238C141.274 238 149.332 229.944 149.332 220.001L149.332 162.611C149.332 152.668 157.39 144.612 167.337 144.612L275.995 144.612C285.942 144.612 294 136.557 294 126.614L294 17.9987C294 8.05548 285.942 -3.12221e-05 275.995 -3.20916e-05L134.108 -4.44958e-05C124.161 -4.53654e-05 116.103 8.05546 116.103 17.9987L116.103 93.3888C116.103 103.332 108.044 111.388 98.0978 111.388L-70.9951 111.388C-80.9417 111.388 -89 119.443 -89 129.386L-89 220.001C-89 229.944 -80.9417 238 -70.9951 238L-71.002 238Z" fill="#CDB9FC">
                            </path>
                            <path d="M173.475 55.945C173.042 54.125 172.284 52.76 171.2 51.85C170.16 50.94 168.644 50.485 166.65 50.485C163.66 50.485 161.45 51.6983 160.02 54.125C158.634 56.5083 157.919 60.4083 157.875 65.825C158.915 64.0917 160.432 62.7483 162.425 61.795C164.419 60.7983 166.585 60.3 168.925 60.3C171.742 60.3 174.234 60.9067 176.4 62.12C178.567 63.3333 180.257 65.11 181.47 67.45C182.684 69.7467 183.29 72.52 183.29 75.77C183.29 78.8467 182.662 81.5983 181.405 84.025C180.192 86.4083 178.394 88.2717 176.01 89.615C173.627 90.9583 170.789 91.63 167.495 91.63C162.989 91.63 159.435 90.6333 156.835 88.64C154.279 86.6467 152.48 83.8733 151.44 80.32C150.444 76.7233 149.945 72.3033 149.945 67.06C149.945 59.13 151.31 53.15 154.04 49.12C156.77 45.0467 161.082 43.01 166.975 43.01C171.525 43.01 175.057 44.245 177.57 46.715C180.084 49.185 181.535 52.2617 181.925 55.945H173.475ZM166.845 67.775C164.549 67.775 162.62 68.4467 161.06 69.79C159.5 71.1333 158.72 73.0833 158.72 75.64C158.72 78.1967 159.435 80.2117 160.865 81.685C162.339 83.1583 164.397 83.895 167.04 83.895C169.38 83.895 171.222 83.18 172.565 81.75C173.952 80.32 174.645 78.3917 174.645 75.965C174.645 73.4517 173.974 71.4583 172.63 69.985C171.33 68.5117 169.402 67.775 166.845 67.775ZM218.643 51.005L201.353 91.5H192.123L209.543 52.045H187.313V44.245H218.643V51.005ZM221.053 55.75C221.053 52.4567 222.006 49.8783 223.913 48.015C225.863 46.1517 228.355 45.22 231.388 45.22C234.421 45.22 236.891 46.1517 238.798 48.015C240.748 49.8783 241.723 52.4567 241.723 55.75C241.723 59.0867 240.748 61.6867 238.798 63.55C236.891 65.4133 234.421 66.345 231.388 66.345C228.355 66.345 225.863 65.4133 223.913 63.55C222.006 61.6867 221.053 59.0867 221.053 55.75ZM262.783 46L237.238 91.5H228.398L253.878 46H262.783ZM231.323 50.68C228.94 50.68 227.748 52.37 227.748 55.75C227.748 59.1733 228.94 60.885 231.323 60.885C232.493 60.885 233.403 60.4733 234.053 59.65C234.703 58.7833 235.028 57.4833 235.028 55.75C235.028 52.37 233.793 50.68 231.323 50.68ZM249.588 81.685C249.588 78.3483 250.541 75.77 252.448 73.95C254.398 72.0867 256.89 71.155 259.923 71.155C262.956 71.155 265.405 72.0867 267.268 73.95C269.175 75.77 270.128 78.3483 270.128 81.685C270.128 85.0217 269.175 87.6217 267.268 89.485C265.405 91.3483 262.956 92.28 259.923 92.28C256.846 92.28 254.355 91.3483 252.448 89.485C250.541 87.6217 249.588 85.0217 249.588 81.685ZM259.858 76.615C257.388 76.615 256.153 78.305 256.153 81.685C256.153 85.1083 257.388 86.82 259.858 86.82C262.285 86.82 263.498 85.1083 263.498 81.685C263.498 78.305 262.285 76.615 259.858 76.615Z" fill="black">
                            </path>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div class="col-12 col-sm-8">
                      <div class="d-flex flex-column py-56 py-sm-80 px-32">
                        <h2 class="fs-28 text-white mb-16">
                          of data leaders don&#39;t fully trust the data in their organisation. Yet they&#39;re being asked to scale AI faster than ever.
                        </h2>
                        <ul class="d-flex flex-column list-custom list-custom-20 list-play-in-circle text-white text-opacity-80 fs-16 gap-16 m-0">
                          <li>
                            What changed in 2026
                          </li>
                          <li>
                            How leading organizations are responding
                          </li>
                          <li>
                            What to prioritize as you plan for 2027
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section class="bg-navy overflow-hidden py-56 pb-md-0 pt-sm-120">
        <div class="container mb-md-n16">
          <div class="row mb-40">
            <div class="col-12">
              <div class="d-flex flex-column align-items-center text-center">
                <div class="d-flex align-items-center mb-8">
                  <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.07387 0.0924387L8.64148 4.3878C9.11951 4.65915 9.11951 5.33754 8.64148 5.60889L1.07387 9.90425C0.595848 10.1756 0 9.83807 0 9.29536V0.704643C0 0.161932 0.595848 -0.175607 1.07387 0.0957479V0.0924387Z" fill="#F655B5">
                    </path>
                  </svg>
                  <span class="fs-12 text-white fw-medium text-uppercase ms-4">                  Agenda
</span>
                </div>
                <h2 class="fs-44 fw-semibold text-white mb-16">
                  Press play on data trust
                </h2>
                <p class="fs-18 text-navy-50 mb-16">
                  Rewind through the shifts in data quality, agentic data management, and governed
                  <br class="d-none d-sm-flex" />
                  context that shaped trusted AI in 2026, then fast-forward to what’s ahead in 2027.
                </p>
                <div class="d-flex">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_40012266_2575)">
                      <rect x="48" y="2.09815e-06" width="48" height="48" rx="24" transform="rotate(90 48 2.09815e-06)" fill="#F10090">
                      </rect>
                      <rect width="48" height="48" transform="translate(0.00195522 -0.00219517) rotate(90)" fill="#1A0C42">
                      </rect>
                      <path d="M30.8706 21.4318L24.8571 31.522C24.4772 32.1593 23.5274 32.1593 23.1475 31.522L17.1341 21.4318C16.7542 20.7945 17.2267 20 17.9865 20L30.0135 20C30.7733 20 31.2459 20.7945 30.866 21.4318L30.8706 21.4318Z" fill="white">
                      </path>
                    </g>
                    <defs>
                      <clipPath id="clip0_40012266_2575">
                        <rect x="48" y="2.09815e-06" width="48" height="48" rx="24" transform="rotate(90 48 2.09815e-06)" fill="white">
                        </rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-11 col-md-12">
              <div class="d-none d-md-flex justify-content-center">
                <div class="fwrd-2026-stack-card-container">
                  <div class="fwrd-2026-stack-cards position-relative">
                    <div class="fwrd-2026-stack-card fwrd-2026-stack-card-1 position-relative d-flex flex-column bg-pink-70 rounded-16 pt-40 pb-120 px-24 z-1">
                      <div class="d-flex align-items-center gap-24 mb-24">
                        <div class="d-flex">
                          <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.0206 -1.01537e-06C14.3361 -2.56139e-06 1.19707e-05 14.3229 1.04261e-05 31.991C8.88154e-06 49.6592 14.3361 63.9821 32.0206 63.9821C49.7051 63.9821 64.0412 49.6592 64.0412 31.991C64.0412 14.3229 49.7051 5.30658e-07 32.0206 -1.01537e-06Z" fill="#1A0C42">
                            </path>
                            <path d="M46.1996 45.275L26.2344 33.7586C24.9733 33.0308 24.9733 31.2122 26.2344 30.4852L46.1997 18.9687C47.4607 18.241 49.0373 19.1507 49.0373 20.6054L49.0373 43.6383C49.0373 45.0931 47.4607 46.0027 46.1996 45.275Z" fill="white">
                            </path>
                            <path d="M30.809 45.277L10.8437 33.7606C9.58272 33.0328 9.58272 31.2142 10.8437 30.4872L30.809 18.9707C32.07 18.243 33.6466 19.1527 33.6466 20.6074L33.6466 43.6403C33.6466 45.0951 32.07 46.0047 30.809 45.277Z" fill="white">
                            </path>
                          </svg>
                        </div>
                        <div class="d-flex flex-column">
                          <span class="fs-14 text-white fw-semibold text-uppercase">                          Session 1
</span>
                          <h3 class="fs-28 text-white fw-semibold m-0">
                            Rewind
                            <br class="d-none d-sm-flex" />
                            through 2026
                          </h3>
                        </div>
                      </div>
                      <p class="fs-14 text-white mb-24">
                        Hear from data leaders at Lennar, Lloyds banking group and Industrial Alliance on how they steered their organizations through massive change this year. Watch demos and ask questions about the latest innovations to the Ataccama ONE platform, including how we ground AI agents in quantified quality scores and context.
                      </p>
                    </div>
                    <div class="fwrd-2026-stack-card fwrd-2026-stack-card-2 position-absolute top-0 left-0 w-100 h-100 d-flex flex-column bg-purple-30 rounded-16 pt-40 pb-120 px-24 z-3">
                      <h3 class="fs-36 text-black fw-semibold mb-16" style="letter-spacing: -1.5px">
                        Looking back to move FWRD
                      </h3>
                      <p class="fs-14 text-navy-70 mb-24">
                        Join the leaders defining data trust and make sure your organization is ready to trust your AI.
                      </p>
                      <div class="d-flex">
                        <a class="btn bg-purple text-white px-24" href="#registration">                        <span>                        Register now
</span>
</a>
                      </div>
                    </div>
                    <div class="fwrd-2026-stack-card fwrd-2026-stack-card-3 position-absolute top-0 left-0 w-100 h-100 d-flex flex-column bg-pink-70 rounded-16 pt-40 pb-120 px-24 z-1">
                      <div class="d-flex align-items-center gap-24 mb-24">
                        <div class="d-flex flex-column">
                          <span class="fs-14 text-white fw-semibold text-uppercase">                          Session 2
</span>
                          <h3 class="fs-28 text-white fw-semibold m-0">
                            Fast-forward
                            <br class="d-none d-sm-flex" />
                            to 2027
                          </h3>
                        </div>
                        <div class="d-flex">
                          <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.0157 64.5312C49.6975 64.8398 64.2814 50.7693 64.5897 33.1038C64.8981 15.4384 50.8141 0.867472 33.1323 0.558835C15.4506 0.250199 0.866671 14.3207 0.558319 31.9862C0.249968 49.6516 14.3339 64.2225 32.0157 64.5312Z" fill="#1A0C42">
                            </path>
                            <path d="M18.629 19.0155L38.3903 30.8786C39.6384 31.6283 39.6067 33.4466 38.3332 34.1516L18.1699 45.3178C16.8964 46.0234 15.3359 45.0864 15.3613 43.6318L15.7633 20.6025C15.7887 19.1479 17.3809 18.2659 18.629 19.0155Z" fill="white">
                            </path>
                            <path d="M34.0177 19.2838L53.779 31.147C55.0271 31.8966 54.9953 33.7149 53.7218 34.4199L33.5586 45.5861C32.2851 46.2917 30.7246 45.3547 30.75 43.9001L31.152 20.8708C31.1774 19.4162 32.7696 18.5342 34.0177 19.2838Z" fill="white">
                            </path>
                          </svg>
                        </div>
                      </div>
                      <p class="fs-14 text-white m-0">
                        Get ahead of the 2027 trends with insights from experts at Mondelēz International, Snowflake and Deloitte on what leading organizations are preparing for as the new year approaches. If automating your data management work, empowering your business users with new workflows, and agents&#39; trust are on your agenda, this is the session for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex d-md-none">
                <div class="module-swipers universal-swiper overflow-visible swiper w-100" ddata-breakpoints="{&#34;780&#34;: {&#34;slidesPerView&#34;: 3}}" data-initial-phone-slide="1" data-initial-slide="1" data-centered-slides="true" data-pagination-element="swiper-pagination-stack-cards" data-pagination-bullet-class="universal-swiper-pagination-bullet-light" data-pagination-bullet-ative-class="universal-swiper-pagination-bullet-light-active">
                  <ul class="swiper-wrapper list-unstyled d-flex m-0">
                    <li class="swiper-slide d-flex flex-column bg-pink-70 rounded-16 pt-40 pb-120 px-24">
                      <div class="d-flex align-items-center gap-24 mb-24">
                        <div class="d-flex">
                          <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.0206 -1.01537e-06C14.3361 -2.56139e-06 1.19707e-05 14.3229 1.04261e-05 31.991C8.88154e-06 49.6592 14.3361 63.9821 32.0206 63.9821C49.7051 63.9821 64.0412 49.6592 64.0412 31.991C64.0412 14.3229 49.7051 5.30658e-07 32.0206 -1.01537e-06Z" fill="#1A0C42">
                            </path>
                            <path d="M46.1996 45.275L26.2344 33.7586C24.9733 33.0308 24.9733 31.2122 26.2344 30.4852L46.1997 18.9687C47.4607 18.241 49.0373 19.1507 49.0373 20.6054L49.0373 43.6383C49.0373 45.0931 47.4607 46.0027 46.1996 45.275Z" fill="white">
                            </path>
                            <path d="M30.809 45.277L10.8437 33.7606C9.58272 33.0328 9.58272 31.2142 10.8437 30.4872L30.809 18.9707C32.07 18.243 33.6466 19.1527 33.6466 20.6074L33.6466 43.6403C33.6466 45.0951 32.07 46.0047 30.809 45.277Z" fill="white">
                            </path>
                          </svg>
                        </div>
                        <div class="d-flex flex-column">
                          <span class="fs-14 text-white fw-semibold text-uppercase">                          Session 1
</span>
                          <h3 class="fs-28 text-white fw-semibold m-0">
                            Rewind
                            <br class="d-none d-sm-flex" />
                            through 2026
                          </h3>
                        </div>
                      </div>
                      <p class="fs-14 text-white mb-24">
                        Hear from data leaders at Lennar, Lloyds banking group and Industrial Alliance on how they steered their organizations through massive change this year. Watch demos and ask questions about the latest innovations to the Ataccama ONE platform, including how we ground AI agents in quantified quality scores and context.
                      </p>
                    </li>
                    <li class="swiper-slide d-flex flex-column bg-purple-30 rounded-16 pt-40 pb-120 px-24">
                      <h3 class="fs-36 text-black fw-semibold mb-16" style="letter-spacing: -1.5px">
                        Looking back to move FWRD
                      </h3>
                      <p class="fs-14 text-navy-70 mb-24">
                        Register now for the full experience to join both sessions, or choose the one most relevant to you.
                      </p>
                      <div class="d-flex">
                        <a class="btn bg-purple text-white px-24" href="#registration">                        <span>                        Register now
</span>
</a>
                      </div>
                    </li>
                    <li class="swiper-slide d-flex flex-column bg-pink-70 rounded-16 pt-40 pb-120 px-24">
                      <div class="d-flex align-items-center gap-24 mb-24">
                        <div class="d-flex flex-column">
                          <span class="fs-14 text-white fw-semibold text-uppercase">                          Session 2
</span>
                          <h3 class="fs-28 text-white fw-semibold m-0">
                            Fast-forward
                            <br class="d-none d-sm-flex" />
                            to 2027
                          </h3>
                        </div>
                        <div class="d-flex">
                          <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.0157 64.5312C49.6975 64.8398 64.2814 50.7693 64.5897 33.1038C64.8981 15.4384 50.8141 0.867472 33.1323 0.558835C15.4506 0.250199 0.866671 14.3207 0.558319 31.9862C0.249968 49.6516 14.3339 64.2225 32.0157 64.5312Z" fill="#1A0C42">
                            </path>
                            <path d="M18.629 19.0155L38.3903 30.8786C39.6384 31.6283 39.6067 33.4466 38.3332 34.1516L18.1699 45.3178C16.8964 46.0234 15.3359 45.0864 15.3613 43.6318L15.7633 20.6025C15.7887 19.1479 17.3809 18.2659 18.629 19.0155Z" fill="white">
                            </path>
                            <path d="M34.0177 19.2838L53.779 31.147C55.0271 31.8966 54.9953 33.7149 53.7218 34.4199L33.5586 45.5861C32.2851 46.2917 30.7246 45.3547 30.75 43.9001L31.152 20.8708C31.1774 19.4162 32.7696 18.5342 34.0177 19.2838Z" fill="white">
                            </path>
                          </svg>
                        </div>
                      </div>
                      <p class="fs-14 text-white m-0">
                        Get ahead of the 2027 trends with insights from experts at Mondelēz International, Snowflake and Deloitte on what leading organizations are preparing for as the new year approaches. If automating your data management work, empowering your business users with new workflows, and agents&#39; trust are on your agenda, this is the session for you.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="d-flex d-md-none justify-content-center mt-24">
                <div class="swiper-pagination-stack-cards d-flex justify-content-center gap-8">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="bg-purple-40 py-56 py-sm-120" id="registration">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-10">
              <div class="d-flex flex-column">
                <svg width="1026" height="407" viewBox="0 0 1026 407" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-100 h-100">
                  <g id="Mask group">
                    <mask id="mask0_2872_9870" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1026" height="407">
                      <rect id="Rectangle 891636" width="1026" height="407" fill="#FC0000">
                      </rect>
                    </mask>
                    <g mask="url(#mask0_2872_9870)">
                      <g id="Group 64325">
                        <g id="Group">
                          <path id="Vector" d="M61.0499 88.0185C85.378 88.0185 105.1 68.3149 105.1 44.0092C105.1 19.7036 85.378 0 61.0499 0C36.7218 0 17 19.7036 17 44.0092C17 68.3149 36.7218 88.0185 61.0499 88.0185Z" fill="#D1F84C">
                          </path>
                          <path id="Vector_2" d="M50.2792 23.9084L80.4421 41.3071C82.3472 42.4066 82.3472 45.1541 80.4421 46.2525L50.2792 63.6512C48.3741 64.7506 45.9922 63.3763 45.9922 61.1785V26.3811C45.9922 24.1833 48.3741 22.809 50.2792 23.9084Z" fill="black">
                          </path>
                        </g>
                        <path id="Vector_3" d="M0 131.32L0 1157.77C0 1179.01 8.84068 1188 19.7407 1188H1006.26C1017.16 1188 1026 1179.01 1026 1157.77V20.0715C1026 8.98882 1017.16 0 1006.26 0H153.923C143.023 0 134.182 8.98882 134.182 20.0715V91.1767C134.182 102.259 125.341 111.248 114.441 111.248H19.7407C8.84068 111.248 0 120.237 0 131.32Z" fill="#1A0C42">
                        </path>
                        <g id="fwrd-2026-date">
                          <path id="Vector_4" d="M432.551 73.1294L443.482 79.1429C444.173 79.5228 444.173 80.4726 443.482 80.8525L432.551 86.866C431.861 87.2458 431 86.7733 431 86.0135V73.9865C431 73.2267 431.861 72.7541 432.551 73.134V73.1294Z" fill="#6A2CF5">
                          </path>
                          <path id="NOV 5 Â· 10 AM ET Â· VIRTUAL" d="M458.521 85H456.925L452.123 77.734V85H450.527V75.256H452.123L456.925 82.508V75.256H458.521V85ZM465.054 85.098C464.149 85.098 463.314 84.888 462.548 84.468C461.792 84.0387 461.19 83.446 460.742 82.69C460.304 81.9247 460.084 81.066 460.084 80.114C460.084 79.162 460.304 78.308 460.742 77.552C461.19 76.796 461.792 76.208 462.548 75.788C463.314 75.3587 464.149 75.144 465.054 75.144C465.969 75.144 466.804 75.3587 467.56 75.788C468.326 76.208 468.928 76.796 469.366 77.552C469.805 78.308 470.024 79.162 470.024 80.114C470.024 81.066 469.805 81.9247 469.366 82.69C468.928 83.446 468.326 84.0387 467.56 84.468C466.804 84.888 465.969 85.098 465.054 85.098ZM465.054 83.712C465.698 83.712 466.272 83.5673 466.776 83.278C467.28 82.9793 467.672 82.5593 467.952 82.018C468.242 81.4673 468.386 80.8327 468.386 80.114C468.386 79.3953 468.242 78.7653 467.952 78.224C467.672 77.6827 467.28 77.2673 466.776 76.978C466.272 76.6887 465.698 76.544 465.054 76.544C464.41 76.544 463.836 76.6887 463.332 76.978C462.828 77.2673 462.432 77.6827 462.142 78.224C461.862 78.7653 461.722 79.3953 461.722 80.114C461.722 80.8327 461.862 81.4673 462.142 82.018C462.432 82.5593 462.828 82.9793 463.332 83.278C463.836 83.5673 464.41 83.712 465.054 83.712ZM479.981 75.27L476.327 85H474.479L470.811 75.27H472.519L475.403 83.362L478.301 75.27H479.981ZM491.322 76.166H486.632V78.952C486.828 78.6907 487.118 78.4713 487.5 78.294C487.892 78.1167 488.308 78.028 488.746 78.028C489.53 78.028 490.165 78.196 490.65 78.532C491.145 78.868 491.495 79.2927 491.7 79.806C491.915 80.3193 492.022 80.8607 492.022 81.43C492.022 82.1207 491.887 82.7367 491.616 83.278C491.355 83.81 490.958 84.23 490.426 84.538C489.904 84.846 489.26 85 488.494 85C487.477 85 486.66 84.748 486.044 84.244C485.428 83.74 485.06 83.0727 484.938 82.242H486.492C486.595 82.6807 486.824 83.0307 487.178 83.292C487.533 83.544 487.976 83.67 488.508 83.67C489.171 83.67 489.666 83.4693 489.992 83.068C490.328 82.6667 490.496 82.1347 490.496 81.472C490.496 80.8 490.328 80.2867 489.992 79.932C489.656 79.568 489.162 79.386 488.508 79.386C488.051 79.386 487.664 79.5027 487.346 79.736C487.038 79.96 486.814 80.268 486.674 80.66H485.162V74.766H491.322V76.166ZM498.23 81.332C497.941 81.332 497.698 81.234 497.502 81.038C497.306 80.842 497.208 80.5993 497.208 80.31C497.208 80.0207 497.306 79.778 497.502 79.582C497.698 79.386 497.941 79.288 498.23 79.288C498.51 79.288 498.748 79.386 498.944 79.582C499.14 79.778 499.238 80.0207 499.238 80.31C499.238 80.5993 499.14 80.842 498.944 81.038C498.748 81.234 498.51 81.332 498.23 81.332ZM504.165 76.25V74.794H507.077V85H505.467V76.25H504.165ZM509.27 79.764C509.27 78.1493 509.54 76.8893 510.082 75.984C510.632 75.0693 511.575 74.612 512.91 74.612C514.244 74.612 515.182 75.0693 515.724 75.984C516.274 76.8893 516.55 78.1493 516.55 79.764C516.55 81.3973 516.274 82.676 515.724 83.6C515.182 84.5147 514.244 84.972 512.91 84.972C511.575 84.972 510.632 84.5147 510.082 83.6C509.54 82.676 509.27 81.3973 509.27 79.764ZM514.982 79.764C514.982 79.008 514.93 78.3687 514.828 77.846C514.734 77.3233 514.538 76.8987 514.24 76.572C513.941 76.236 513.498 76.068 512.91 76.068C512.322 76.068 511.878 76.236 511.58 76.572C511.281 76.8987 511.08 77.3233 510.978 77.846C510.884 78.3687 510.838 79.008 510.838 79.764C510.838 80.548 510.884 81.206 510.978 81.738C511.071 82.27 511.267 82.6993 511.566 83.026C511.874 83.3527 512.322 83.516 512.91 83.516C513.498 83.516 513.941 83.3527 514.24 83.026C514.548 82.6993 514.748 82.27 514.842 81.738C514.935 81.206 514.982 80.548 514.982 79.764ZM527.951 83.012H523.877L523.177 85H521.511L524.997 75.256H526.845L530.331 85H528.651L527.951 83.012ZM527.503 81.71L525.921 77.188L524.325 81.71H527.503ZM542.095 75.27V85H540.499V78.336L537.531 85H536.425L533.443 78.336V85H531.847V75.27H533.569L536.985 82.9L540.387 75.27H542.095ZM549.425 76.558V79.414H552.785V80.716H549.425V83.698H553.205V85H547.829V75.256H553.205V76.558H549.425ZM561.457 75.27V76.572H558.867V85H557.271V76.572H554.667V75.27H561.457ZM567.41 81.332C567.121 81.332 566.878 81.234 566.682 81.038C566.486 80.842 566.388 80.5993 566.388 80.31C566.388 80.0207 566.486 79.778 566.682 79.582C566.878 79.386 567.121 79.288 567.41 79.288C567.69 79.288 567.928 79.386 568.124 79.582C568.32 79.778 568.418 80.0207 568.418 80.31C568.418 80.5993 568.32 80.842 568.124 81.038C567.928 81.234 567.69 81.332 567.41 81.332ZM582.151 75.27L578.497 85H576.649L572.981 75.27H574.689L577.573 83.362L580.471 75.27H582.151ZM585.082 75.27V85H583.486V75.27H585.082ZM592.231 85L589.991 81.108H588.773V85H587.177V75.27H590.537C591.284 75.27 591.914 75.4007 592.427 75.662C592.95 75.9233 593.337 76.2733 593.589 76.712C593.85 77.1507 593.981 77.6407 593.981 78.182C593.981 78.8167 593.794 79.3953 593.421 79.918C593.057 80.4313 592.492 80.7813 591.727 80.968L594.135 85H592.231ZM588.773 79.834H590.537C591.134 79.834 591.582 79.6847 591.881 79.386C592.189 79.0873 592.343 78.686 592.343 78.182C592.343 77.678 592.194 77.286 591.895 77.006C591.596 76.7167 591.144 76.572 590.537 76.572H588.773V79.834ZM602.309 75.27V76.572H599.719V85H598.123V76.572H595.519V75.27H602.309ZM605.507 75.27V81.472C605.507 82.2093 605.698 82.7647 606.081 83.138C606.473 83.5113 607.014 83.698 607.705 83.698C608.405 83.698 608.946 83.5113 609.329 83.138C609.721 82.7647 609.917 82.2093 609.917 81.472V75.27H611.513V81.444C611.513 82.2373 611.34 82.9093 610.995 83.46C610.65 84.0107 610.188 84.4213 609.609 84.692C609.03 84.9627 608.391 85.098 607.691 85.098C606.991 85.098 606.352 84.9627 605.773 84.692C605.204 84.4213 604.751 84.0107 604.415 83.46C604.079 82.9093 603.911 82.2373 603.911 81.444V75.27H605.507ZM619.457 83.012H615.383L614.683 85H613.017L616.503 75.256H618.351L621.837 85H620.157L619.457 83.012ZM619.009 81.71L617.427 77.188L615.831 81.71H619.009ZM624.949 83.712H628.239V85H623.353V75.27H624.949V83.712Z" fill="white">
                          </path>
                        </g>
                        <g id="fwrd-2026-title">
                          <g id="fwrd-2026-shape">
                            <path id="Vector_5" d="M552.915 233.282C528.894 233.282 517.044 221.432 517.044 197.411L486.791 227.664C510.824 227.664 522.662 239.514 522.662 263.535L552.915 233.282Z" fill="#CDB9FC">
                            </path>
                            <path id="Vector_6" d="M160.693 227.979L494.455 227.979C506.984 227.979 517.141 217.823 517.141 205.294V156.753C517.141 144.224 506.984 134.068 494.455 134.068L160.693 134.068C148.164 134.068 138.007 144.224 138.007 156.753V205.294C138.007 217.823 148.164 227.979 160.693 227.979Z" fill="#CDB9FC">
                            </path>
                            <path id="Vector_7" d="M541.863 326.999L865.76 326.999C876.37 326.999 884.971 318.398 884.971 307.788V252.298C884.971 241.688 876.37 233.087 865.76 233.087L541.863 233.087C531.253 233.087 522.652 241.688 522.652 252.298V307.788C522.652 318.398 531.253 326.999 541.863 326.999Z" fill="#CDB9FC">
                            </path>
                          </g>
                          <g id="fwrd-2026-text">
                            <path d="M191.57 173.67C191.57 176.097 190.985 178.372 189.815 180.495C188.688 182.618 186.89 184.33 184.42 185.63C181.993 186.93 178.917 187.58 175.19 187.58H167.585V205H158.485V159.63H175.19C178.7 159.63 181.69 160.237 184.16 161.45C186.63 162.663 188.472 164.332 189.685 166.455C190.942 168.578 191.57 170.983 191.57 173.67ZM174.8 180.235C177.313 180.235 179.177 179.672 180.39 178.545C181.603 177.375 182.21 175.75 182.21 173.67C182.21 169.25 179.74 167.04 174.8 167.04H167.585V180.235H174.8ZM207.131 174.58C208.301 172.673 209.818 171.178 211.681 170.095C213.588 169.012 215.754 168.47 218.181 168.47V178.025H215.776C212.916 178.025 210.749 178.697 209.276 180.04C207.846 181.383 207.131 183.723 207.131 187.06V205H198.031V168.99H207.131V174.58ZM257.785 186.215C257.785 187.515 257.699 188.685 257.525 189.725H231.2C231.417 192.325 232.327 194.362 233.93 195.835C235.534 197.308 237.505 198.045 239.845 198.045C243.225 198.045 245.63 196.593 247.06 193.69H256.875C255.835 197.157 253.842 200.017 250.895 202.27C247.949 204.48 244.33 205.585 240.04 205.585C236.574 205.585 233.454 204.827 230.68 203.31C227.95 201.75 225.805 199.562 224.245 196.745C222.729 193.928 221.97 190.678 221.97 186.995C221.97 183.268 222.729 179.997 224.245 177.18C225.762 174.363 227.885 172.197 230.615 170.68C233.345 169.163 236.487 168.405 240.04 168.405C243.464 168.405 246.519 169.142 249.205 170.615C251.935 172.088 254.037 174.19 255.51 176.92C257.027 179.607 257.785 182.705 257.785 186.215ZM248.36 183.615C248.317 181.275 247.472 179.412 245.825 178.025C244.179 176.595 242.164 175.88 239.78 175.88C237.527 175.88 235.62 176.573 234.06 177.96C232.544 179.303 231.612 181.188 231.265 183.615H248.36ZM278.207 205.585C275.261 205.585 272.617 205.065 270.277 204.025C267.937 202.942 266.074 201.49 264.687 199.67C263.344 197.85 262.607 195.835 262.477 193.625H271.642C271.816 195.012 272.487 196.16 273.657 197.07C274.871 197.98 276.366 198.435 278.142 198.435C279.876 198.435 281.219 198.088 282.172 197.395C283.169 196.702 283.667 195.813 283.667 194.73C283.667 193.56 283.061 192.693 281.847 192.13C280.677 191.523 278.792 190.873 276.192 190.18C273.506 189.53 271.296 188.858 269.562 188.165C267.872 187.472 266.399 186.41 265.142 184.98C263.929 183.55 263.322 181.622 263.322 179.195C263.322 177.202 263.886 175.382 265.012 173.735C266.182 172.088 267.829 170.788 269.952 169.835C272.119 168.882 274.654 168.405 277.557 168.405C281.847 168.405 285.271 169.488 287.827 171.655C290.384 173.778 291.792 176.66 292.052 180.3H283.342C283.212 178.87 282.606 177.743 281.522 176.92C280.482 176.053 279.074 175.62 277.297 175.62C275.651 175.62 274.372 175.923 273.462 176.53C272.596 177.137 272.162 177.982 272.162 179.065C272.162 180.278 272.769 181.21 273.982 181.86C275.196 182.467 277.081 183.095 279.637 183.745C282.237 184.395 284.382 185.067 286.072 185.76C287.762 186.453 289.214 187.537 290.427 189.01C291.684 190.44 292.334 192.347 292.377 194.73C292.377 196.81 291.792 198.673 290.622 200.32C289.496 201.967 287.849 203.267 285.682 204.22C283.559 205.13 281.067 205.585 278.207 205.585ZM313.627 205.585C310.681 205.585 308.037 205.065 305.697 204.025C303.357 202.942 301.494 201.49 300.107 199.67C298.764 197.85 298.027 195.835 297.897 193.625H307.062C307.236 195.012 307.907 196.16 309.077 197.07C310.291 197.98 311.786 198.435 313.562 198.435C315.296 198.435 316.639 198.088 317.592 197.395C318.589 196.702 319.087 195.813 319.087 194.73C319.087 193.56 318.481 192.693 317.267 192.13C316.097 191.523 314.212 190.873 311.612 190.18C308.926 189.53 306.716 188.858 304.982 188.165C303.292 187.472 301.819 186.41 300.562 184.98C299.349 183.55 298.742 181.622 298.742 179.195C298.742 177.202 299.306 175.382 300.432 173.735C301.602 172.088 303.249 170.788 305.372 169.835C307.539 168.882 310.074 168.405 312.977 168.405C317.267 168.405 320.691 169.488 323.247 171.655C325.804 173.778 327.212 176.66 327.472 180.3H318.762C318.632 178.87 318.026 177.743 316.942 176.92C315.902 176.053 314.494 175.62 312.717 175.62C311.071 175.62 309.792 175.923 308.882 176.53C308.016 177.137 307.582 177.982 307.582 179.065C307.582 180.278 308.189 181.21 309.402 181.86C310.616 182.467 312.501 183.095 315.057 183.745C317.657 184.395 319.802 185.067 321.492 185.76C323.182 186.453 324.634 187.537 325.847 189.01C327.104 190.44 327.754 192.347 327.797 194.73C327.797 196.81 327.212 198.673 326.042 200.32C324.916 201.967 323.269 203.267 321.102 204.22C318.979 205.13 316.487 205.585 313.627 205.585ZM359.856 174.19C361.026 172.543 362.629 171.178 364.666 170.095C366.746 168.968 369.107 168.405 371.751 168.405C374.827 168.405 377.601 169.163 380.071 170.68C382.584 172.197 384.556 174.363 385.986 177.18C387.459 179.953 388.196 183.182 388.196 186.865C388.196 190.548 387.459 193.82 385.986 196.68C384.556 199.497 382.584 201.685 380.071 203.245C377.601 204.805 374.827 205.585 371.751 205.585C369.107 205.585 366.767 205.043 364.731 203.96C362.737 202.877 361.112 201.512 359.856 199.865V222.16H350.756V168.99H359.856V174.19ZM378.901 186.865C378.901 184.698 378.446 182.835 377.536 181.275C376.669 179.672 375.499 178.458 374.026 177.635C372.596 176.812 371.036 176.4 369.346 176.4C367.699 176.4 366.139 176.833 364.666 177.7C363.236 178.523 362.066 179.737 361.156 181.34C360.289 182.943 359.856 184.828 359.856 186.995C359.856 189.162 360.289 191.047 361.156 192.65C362.066 194.253 363.236 195.488 364.666 196.355C366.139 197.178 367.699 197.59 369.346 197.59C371.036 197.59 372.596 197.157 374.026 196.29C375.499 195.423 376.669 194.188 377.536 192.585C378.446 190.982 378.901 189.075 378.901 186.865ZM403.908 156.9V205H394.808V156.9H403.908ZM410.559 186.865C410.559 183.225 411.274 179.997 412.704 177.18C414.177 174.363 416.149 172.197 418.619 170.68C421.132 169.163 423.927 168.405 427.004 168.405C429.691 168.405 432.031 168.947 434.024 170.03C436.061 171.113 437.686 172.478 438.899 174.125V168.99H448.064V205H438.899V199.735C437.729 201.425 436.104 202.833 434.024 203.96C431.987 205.043 429.626 205.585 426.939 205.585C423.906 205.585 421.132 204.805 418.619 203.245C416.149 201.685 414.177 199.497 412.704 196.68C411.274 193.82 410.559 190.548 410.559 186.865ZM438.899 186.995C438.899 184.785 438.466 182.9 437.599 181.34C436.732 179.737 435.562 178.523 434.089 177.7C432.616 176.833 431.034 176.4 429.344 176.4C427.654 176.4 426.094 176.812 424.664 177.635C423.234 178.458 422.064 179.672 421.154 181.275C420.287 182.835 419.854 184.698 419.854 186.865C419.854 189.032 420.287 190.938 421.154 192.585C422.064 194.188 423.234 195.423 424.664 196.29C426.137 197.157 427.697 197.59 429.344 197.59C431.034 197.59 432.616 197.178 434.089 196.355C435.562 195.488 436.732 194.275 437.599 192.715C438.466 191.112 438.899 189.205 438.899 186.995ZM491.402 168.99L469.107 222.03H459.422L467.222 204.09L452.792 168.99H462.997L472.292 194.145L481.717 168.99H491.402ZM546.462 277.865C546.462 274.225 547.177 270.997 548.607 268.18C550.081 265.363 552.074 263.197 554.587 261.68C557.101 260.163 559.896 259.405 562.972 259.405C565.312 259.405 567.544 259.925 569.667 260.965C571.791 261.962 573.481 263.305 574.737 264.995V247.9H583.967V296H574.737V290.67C573.611 292.447 572.029 293.877 569.992 294.96C567.956 296.043 565.594 296.585 562.907 296.585C559.874 296.585 557.101 295.805 554.587 294.245C552.074 292.685 550.081 290.497 548.607 287.68C547.177 284.82 546.462 281.548 546.462 277.865ZM574.802 277.995C574.802 275.785 574.369 273.9 573.502 272.34C572.636 270.737 571.466 269.523 569.992 268.7C568.519 267.833 566.937 267.4 565.247 267.4C563.557 267.4 561.997 267.812 560.567 268.635C559.137 269.458 557.967 270.672 557.057 272.275C556.191 273.835 555.757 275.698 555.757 277.865C555.757 280.032 556.191 281.938 557.057 283.585C557.967 285.188 559.137 286.423 560.567 287.29C562.041 288.157 563.601 288.59 565.247 288.59C566.937 288.59 568.519 288.178 569.992 287.355C571.466 286.488 572.636 285.275 573.502 283.715C574.369 282.112 574.802 280.205 574.802 277.995ZM590.515 277.865C590.515 274.225 591.23 270.997 592.66 268.18C594.133 265.363 596.105 263.197 598.575 261.68C601.088 260.163 603.883 259.405 606.96 259.405C609.647 259.405 611.987 259.947 613.98 261.03C616.017 262.113 617.642 263.478 618.855 265.125V259.99H628.02V296H618.855V290.735C617.685 292.425 616.06 293.833 613.98 294.96C611.943 296.043 609.582 296.585 606.895 296.585C603.862 296.585 601.088 295.805 598.575 294.245C596.105 292.685 594.133 290.497 592.66 287.68C591.23 284.82 590.515 281.548 590.515 277.865ZM618.855 277.995C618.855 275.785 618.422 273.9 617.555 272.34C616.688 270.737 615.518 269.523 614.045 268.7C612.572 267.833 610.99 267.4 609.3 267.4C607.61 267.4 606.05 267.812 604.62 268.635C603.19 269.458 602.02 270.672 601.11 272.275C600.243 273.835 599.81 275.698 599.81 277.865C599.81 280.032 600.243 281.938 601.11 283.585C602.02 285.188 603.19 286.423 604.62 287.29C606.093 288.157 607.653 288.59 609.3 288.59C610.99 288.59 612.572 288.178 614.045 287.355C615.518 286.488 616.688 285.275 617.555 283.715C618.422 282.112 618.855 280.205 618.855 277.995ZM647.503 267.465V284.885C647.503 286.098 647.785 286.987 648.348 287.55C648.955 288.07 649.951 288.33 651.338 288.33H655.563V296H649.843C642.173 296 638.338 292.273 638.338 284.82V267.465H634.048V259.99H638.338V251.085H647.503V259.99H655.563V267.465H647.503ZM659.768 277.865C659.768 274.225 660.483 270.997 661.913 268.18C663.386 265.363 665.358 263.197 667.828 261.68C670.341 260.163 673.136 259.405 676.213 259.405C678.9 259.405 681.24 259.947 683.233 261.03C685.27 262.113 686.895 263.478 688.108 265.125V259.99H697.273V296H688.108V290.735C686.938 292.425 685.313 293.833 683.233 294.96C681.196 296.043 678.835 296.585 676.148 296.585C673.115 296.585 670.341 295.805 667.828 294.245C665.358 292.685 663.386 290.497 661.913 287.68C660.483 284.82 659.768 281.548 659.768 277.865ZM688.108 277.995C688.108 275.785 687.675 273.9 686.808 272.34C685.941 270.737 684.771 269.523 683.298 268.7C681.825 267.833 680.243 267.4 678.553 267.4C676.863 267.4 675.303 267.812 673.873 268.635C672.443 269.458 671.273 270.672 670.363 272.275C669.496 273.835 669.063 275.698 669.063 277.865C669.063 280.032 669.496 281.938 670.363 283.585C671.273 285.188 672.443 286.423 673.873 287.29C675.346 288.157 676.906 288.59 678.553 288.59C680.243 288.59 681.825 288.178 683.298 287.355C684.771 286.488 685.941 285.275 686.808 283.715C687.675 282.112 688.108 280.205 688.108 277.995ZM732.244 267.465V284.885C732.244 286.098 732.526 286.987 733.089 287.55C733.696 288.07 734.692 288.33 736.079 288.33H740.304V296H734.584C726.914 296 723.079 292.273 723.079 284.82V267.465H718.789V259.99H723.079V251.085H732.244V259.99H740.304V267.465H732.244ZM755.949 265.58C757.119 263.673 758.636 262.178 760.499 261.095C762.406 260.012 764.573 259.47 766.999 259.47V269.025H764.594C761.734 269.025 759.568 269.697 758.094 271.04C756.664 272.383 755.949 274.723 755.949 278.06V296H746.849V259.99H755.949V265.58ZM807.124 259.99V296H797.959V291.45C796.789 293.01 795.25 294.245 793.344 295.155C791.48 296.022 789.444 296.455 787.234 296.455C784.417 296.455 781.925 295.87 779.759 294.7C777.592 293.487 775.88 291.732 774.624 289.435C773.41 287.095 772.804 284.322 772.804 281.115V259.99H781.904V279.815C781.904 282.675 782.619 284.885 784.049 286.445C785.479 287.962 787.429 288.72 789.899 288.72C792.412 288.72 794.384 287.962 795.814 286.445C797.244 284.885 797.959 282.675 797.959 279.815V259.99H807.124ZM829.882 296.585C826.936 296.585 824.292 296.065 821.952 295.025C819.612 293.942 817.749 292.49 816.362 290.67C815.019 288.85 814.282 286.835 814.152 284.625H823.317C823.491 286.012 824.162 287.16 825.332 288.07C826.546 288.98 828.041 289.435 829.817 289.435C831.551 289.435 832.894 289.088 833.847 288.395C834.844 287.702 835.342 286.813 835.342 285.73C835.342 284.56 834.736 283.693 833.522 283.13C832.352 282.523 830.467 281.873 827.867 281.18C825.181 280.53 822.971 279.858 821.237 279.165C819.547 278.472 818.074 277.41 816.817 275.98C815.604 274.55 814.997 272.622 814.997 270.195C814.997 268.202 815.561 266.382 816.687 264.735C817.857 263.088 819.504 261.788 821.627 260.835C823.794 259.882 826.329 259.405 829.232 259.405C833.522 259.405 836.946 260.488 839.502 262.655C842.059 264.778 843.467 267.66 843.727 271.3H835.017C834.887 269.87 834.281 268.743 833.197 267.92C832.157 267.053 830.749 266.62 828.972 266.62C827.326 266.62 826.047 266.923 825.137 267.53C824.271 268.137 823.837 268.982 823.837 270.065C823.837 271.278 824.444 272.21 825.657 272.86C826.871 273.467 828.756 274.095 831.312 274.745C833.912 275.395 836.057 276.067 837.747 276.76C839.437 277.453 840.889 278.537 842.102 280.01C843.359 281.44 844.009 283.347 844.052 285.73C844.052 287.81 843.467 289.673 842.297 291.32C841.171 292.967 839.524 294.267 837.357 295.22C835.234 296.13 832.742 296.585 829.882 296.585ZM862.117 267.465V284.885C862.117 286.098 862.399 286.987 862.962 287.55C863.569 288.07 864.565 288.33 865.952 288.33H870.177V296H864.457C856.787 296 852.952 292.273 852.952 284.82V267.465H848.662V259.99H852.952V251.085H862.117V259.99H870.177V267.465H862.117Z" fill="white">
                            </path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <div class="position-relative d-flex flex-column bg-navy rounded-bottom-16 pb-40 pb-sm-80 pt-24 pt-sm-0" style="top: -1px;">
                  <div class="row justify-content-center">
                    <div class="col-12 col-sm-8">
                      <div class="module-components hs-form d-flex flex-column bg-white rounded-24 px-16 py-32 px-sm-32 mx-16 mx-sm-0 hs-progressive form-styling hs-form-lazy-loaded" data-final-hs="b42a1415-b6fb-4eee-9735-3fb3024cffbf" data-redirect-url="https://www.ataccama.com/fwrd2026/thank-you" data-utm-passthrough="true">
                        <span class="fs-21 text-navy mb-24">                        Register now
</span>
                        <div class="hs-progressive-email hbspt-form">
                          <form class="native-progressive-form" data-form-id="b42a1415-b6fb-4eee-9735-3fb3024cffbf" data-instance-id="6f83548d-d3ee-cb69-5b4c-00004ee39373" data-step="email">
                            <fieldset class="form-columns-1">
                              <div class="hs-form-field hs-fieldtype-text">
                                <label for="email-6f83548d-d3ee-cb69-5b4c-00004ee39373" style="display: none;">
                                  Business email
                                </label>
                                <input type="email" name="email" id="email-6f83548d-d3ee-cb69-5b4c-00004ee39373" class="hs-input hs-progressive-email-input" required="" placeholder="Enter your email" />
                                <ul class="no-list hs-error-msgs inputs-list" role="alert">
                                  <li>
                                    <label class="hs-error-msg hs-main-font-element" style="display: none;">
                                      Please enter a valid email address.
                                    </label>
                                  </li>
                                  <li>
                                    <label class="hs-error-msg hs-main-font-element email-is-not-valid" style="display: none;">
                                      Please enter a different email address
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </fieldset>
                            <fieldset class="form-columns-1">
                              <div class="legal-consent-container">
                                <div class="hs-richtext">
                                  <p>
                                    Please choose your communication preferences:
                                  </p>
                                </div>
                                <div>
                                  <div class="hs-dependent-field">
                                    <div class="hs_LEGAL_CONSENT.subscription_type_64240046 hs-LEGAL_CONSENT.subscription_type_64240046 hs-fieldtype-booleancheckbox field hs-form-field">
                                      <div class="input">
                                        <ul class="inputs-list">
                                          <li class="hs-form-booleancheckbox">
                                            <label for="LEGAL_CONSENT.subscription_type_64240046-6f83548d-d3ee-cb69-5b4c-00004ee39373" class="hs-form-booleancheckbox-display">
                                              <input id="LEGAL_CONSENT.subscription_type_64240046-6f83548d-d3ee-cb69-5b4c-00004ee39373" class="hs-input" type="checkbox" name="LEGAL_CONSENT.subscription_type_64240046" value="true" />
                                              <span>                                              <p>
                                                <strong>                                                I would like to receive news, updates, future event invitations, and other offers from Ataccama.
</strong>
                                              </p>
</span>
                                            </label>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <legend class="hs-field-desc checkbox-desc" style="display: none;">
                                  </legend>
                                </div>
                                <div>
                                  <div class="hs-dependent-field">
                                    <div class="hs_LEGAL_CONSENT.subscription_type_73755271 hs-LEGAL_CONSENT.subscription_type_73755271 hs-fieldtype-booleancheckbox field hs-form-field">
                                      <div class="input">
                                        <ul class="inputs-list">
                                          <li class="hs-form-booleancheckbox">
                                            <label for="LEGAL_CONSENT.subscription_type_73755271-6f83548d-d3ee-cb69-5b4c-00004ee39373" class="hs-form-booleancheckbox-display">
                                              <input id="LEGAL_CONSENT.subscription_type_73755271-6f83548d-d3ee-cb69-5b4c-00004ee39373" class="hs-input" type="checkbox" name="LEGAL_CONSENT.subscription_type_73755271" value="true" />
                                              <span>                                              <p>
                                                I agree to being contacted by Ataccama&#39;s partners, acting as data controllers, for the purpose of sharing their news, updates, future event invitations, and other offers.
                                              </p>
</span>
                                            </label>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <legend class="hs-field-desc checkbox-desc" style="display: none;">
                                  </legend>
                                </div>
                                <div class="hs-richtext">
                                  <p class="fs-12">
                                    By clicking submit, you agree to our
                                    <a href="https://www.ataccama.com/legal/privacy-policy" target="_blank">                                    privacy policy
</a>
                                    . Review it for more information on how to unsubscribe, our privacy practices, and how we are committed to protecting and respecting your privacy.
                                  </p>
                                </div>
                              </div>
                            </fieldset>
                            <div class="hs-submit">
                              <input type="submit" value="Continue" class="hs-button primary pe-none" style="opacity: 0.5;" />
                            </div>
                          </form>
                        </div>
                        <div class="hs-progressive-form hbspt-form" id="hubspot-form-container">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!--
Performance optimized by W3 Total Cache. Learn more: https://www.boldgrid.com/w3-total-cache/?utm_source=w3tc&utm_medium=footer_comment&utm_campaign=free_plugin


Served from: www.ataccama.com @ 2026-11-22 18:45:12 by W3 Total Cache
-->
  </body>
</html>
```
