This is the latest code with out any changes in node module library.

This will build fine but when you add it to the grafana, it won't work because the module added in 
@types/grafana is not somehow supporting the plugin. It is not official version provided by grafana.

Now to make work it,

add following code in node_modules/@types/grafana/app/core/core_module.d.ts

// declare var _default: any;
// export default _default;

export var _default: any;


and in src/domain/owner/OwnerListPage/index.tsx,

comment line no: 4 and uncomment line no: 3

This way, plugin will be added in grafana and directive error will not come. This is temporary way to 
add plugin and make apollo-client working. There is an issue also on which I am working.