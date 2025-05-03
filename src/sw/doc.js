
import PouchDB from 'pouchdb-core';
import pluginHttp from 'pouchdb-adapter-http';
import pluginIndexedDB from 'pouchdb-adapter-indexeddb';
import pluginReplication from 'pouchdb-replication';
import pluginMapreduce from 'pouchdb-mapreduce';
import pluginFind from 'pouchdb-find';

PouchDB
  .plugin(pluginHttp)
  .plugin(pluginIndexedDB)  // var db = new PouchDB('mydb', {adapter: 'indexeddb'});
  .plugin(pluginReplication)
  .plugin(pluginMapreduce)
  .plugin(pluginFind);

export function getDoc(mdm) {

  return {

    match(request) {

    },

    respond(event) {

    }

  };
}
