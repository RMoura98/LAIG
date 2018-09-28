 /**
  * @constructor Node
  * @param string id
  */

function node(id){
  this.material = null;
  this.texture = null;
  this.matTransf = null;
  this.descendants = [];
}

Node.prototype.insere = function (nodeName) {
  this.descendants.push(nodeName);
}
