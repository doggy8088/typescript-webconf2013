
var obj1: { property: string; } = { property: "foo" }

obj1.property = 'OK';

// ----------------------------------------------

interface MyObjLayout {
    property: string;
}

var obj2: MyObjLayout = { property: "foo" };
