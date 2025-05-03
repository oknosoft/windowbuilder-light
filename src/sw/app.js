/**
 * уточнения к сервисворкеру
 */

import {precacheAndRoute} from 'workbox-precaching';
import {mdm} from './mdm';
import {getAuth} from './auth';
import {getDoc} from './doc';

const auth = getAuth(mdm);
const doc = getDoc(mdm);
const dkey = '20250502';

export default function () {

  precacheAndRoute([
    // {url: '/dynamic-settings.js', revision: dkey },
    // {url: '/static/js/bundle.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_wb-core_dist_superlogin-proxy_index_js.chunk.js', revision: dkey },
    // {url: '/static/js/src_metadata_actions_js.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_mui_material_esm_FilledInput_filledInputClasses_js-node_modules_mui_mate-e2168d.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_mui_material_esm_Menu_Menu_js-node_modules_mui_material_esm_internal_Swi-25004b.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_paper_dist_paper-core_js.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_mui_material_esm_TextField_TextField_js.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_mui_material_esm_Grow_Grow_js-node_modules_mui_material_esm_List_List_js-1b7cab.chunk.js', revision: dkey },
    // {url: '/static/js/src_metadata_index_js-node_modules_moment_locale_sync_recursive_.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_react-helmet_es_Helmet_js-node_modules_mui_icons-material_esm_BusinessCe-f76f68.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_react-data-grid_lib_styles_css.chunk.js', revision: dkey },
    // {url: '/static/js/src_components_App_index_js.chunk.js', revision: dkey },
    // {url: '/static/js/src_styles_patch_css.chunk.js', revision: dkey },
    // {url: '/static/js/src_metadata_Router_js.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_mui_material_esm_Chip_Chip_js-node_modules_mui_system_esm_styled_styled_-1a2651.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_metadata-ui_DataField_Autocomplete_js.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_mui_material_esm_InputAdornment_InputAdornment_js-node_modules_mui_mater-4b71e6.chunk.js', revision: dkey },
    // {url: '/static/js/src_components_FrmLogin_index_js.chunk.js', revision: dkey },
    // {url: '/static/js/node_modules_metadata-ui_styles_indicator_index_css.chunk.js', revision: dkey },
    // {url: '/static/js/vendors-node_modules_fontsource_roboto_300_css.chunk.js', revision: null },
    // {url: '/static/js/vendors-node_modules_fontsource_roboto_400_css.chunk.js', revision: null },
    // {url: '/static/js/vendors-node_modules_fontsource_roboto_500_css.chunk.js', revision: null },
    // {url: '/static/js/vendors-node_modules_fontsource_roboto_700_css.chunk.js', revision: null },
    // {url: '/static/media/roboto-cyrillic-500-normal.1fb2c6d685bfb888cfa3.woff2', revision: null },
    // {url: '/static/media/roboto-cyrillic-400-normal.86d5c52f4588f9f221d7.woff2', revision: null },
    // {url: '/static/media/roboto-latin-400-normal.df1be0be92f6f19b8115.woff2', revision: null },
    // {url: '/static/media/roboto-latin-500-normal.599f66a60bdf974e578e.woff2', revision: null },
    // {url: '/static/media/roboto-cyrillic-500-normal.36f79cc7e73a69da4438.woff', revision: null },
    // {url: '/static/media/roboto-cyrillic-400-normal.d67ac585bb6a05dbf71c.woff', revision: null },
    // {url: '/static/media/roboto-latin-400-normal.50a0a61e29c19a2f05cb.woff', revision: null },
    // {url: '/static/media/roboto-latin-500-normal.c320def131b39bceabd8.woff', revision: null },
    {url: '/manifest.webmanifest', revision: null},
    {url: '/favicon.ico', revision: null},
    {url: '/imgs/fav-okn144.png', revision: null},
  ]);
}


self.addEventListener('fetch', (event) => {
  const {url} = event.request;
  if(url.includes(mdm.delimiter)) {
    mdm.respond(event);
  }
  else if(url.includes(auth.delimiter)) {
    auth.respond(event);
  }
  else if(doc.match(event.request)) {
    doc.respond(event);
  }
});
