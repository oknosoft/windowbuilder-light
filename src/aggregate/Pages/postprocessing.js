
export async function postprocessing(pathname, text) {
  if(pathname.startsWith('/about')) {
    return text.replace('$version$', $p.job_prm.version?.raw ? `Версия: _${$p.job_prm.version.raw.build}_
    ` : '');
  }
  return text;
}
