 /**
  * @constructor Node
  * @param string id
  */

 function Node(id) {

  this.id = id;

  this.material = null;

  this.texture = null;

  this.matTransfRef = null;

  this.matTransf = mat4.create();
  mat4.identity(this.transformMatrix);

  this.descendants = [];

  this.primitives = [];
}

Node.prototype.insertChild = function (nodeId) {
  this.descendants.push(nodeId);
}

Node.prototype.inserPrimitive = function (primitive) {
  this.primitives.push(primitive);
}
