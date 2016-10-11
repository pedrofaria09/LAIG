XMLscene.Prototype.ProcessaGrafo = function(nodeName) {
    var material = null;

    if (nodeName != null) {
        var node = this.grafo[nodeName];
        if (node.material != null)
            material = node.material;
        if (material != null)
            this.applyMaterial(material);
        this.mulMatrix(node.m);
        if (node.Primitive != null) {
            //Desenha primitiva
        }
        for (i = 0; i < node.Children.length; i++) {
            this.pushMatrix();
                this.applyMaterial(material);
                this.ProcessaGrafo(node.Children[i]);
            this.popMatrix();
        }
    }
}
