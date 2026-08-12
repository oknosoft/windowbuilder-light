
const {wsql, adapters: {pouch}} = $p;

const uid = wsql.get_user_param('browser_uid');
const timeout = 80000;

export const locker = {

  timer: null,

  lock(ref) {
    return pouch.fetch(`/adm/api/lock?ref=work_centers_task|${ref}&uid=${uid}`)
      .then(res => res.json())
      .then(res => {
        if(res.ok) {
          this.refresh(ref);
        }
        else {
          throw res.message;
        }
      });
  },

  unlock(ref) {
    return pouch.fetch(`/adm/api/lock/unlock?ref=work_centers_task|${ref}&uid=${uid}`);
  },

  refresh(ref) {
    clearTimeout(this.timer);
    setTimeout(() => this.lock(ref)
      .then(() => this.refresh(ref))
      .catch(() => null), timeout);
  },

  cancel() {
    clearTimeout(this.timer);
  }

};

