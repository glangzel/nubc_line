function deleteAllCache(cache) { //生成したキャッシュをすべて破棄し、記録などの作業が終わった後もキャッシュが残らないようにする。
  cache.remove("temp");
  cache.remove("cond");
  cache.remove("travel");
  cache.remove("type");
}
