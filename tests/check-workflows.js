const fs=require('fs'),path=require('path'),assert=require('assert');let count=0;
const ok=x=>{assert(x);count++};
const flows=['financial-news','reviewed-publisher'].map(n=>JSON.parse(fs.readFileSync(path.join(__dirname,'../workflows/'+n+'.json'))));
for(const d of flows){
 ok(d.active===false);ok(Object.keys(d.pinData).length===0);
 const names=new Set(d.nodes.map(n=>n.name));
 for(const n of d.nodes){ok(!n.credentials);if(n.parameters.jsCode)new Function('$','$input','$execution',n.parameters.jsCode);}
 for(const routes of Object.values(d.connections))for(const branches of Object.values(routes))for(const branch of branches)for(const t of branch)ok(names.has(t.node));
}
const nodes=Object.fromEntries(flows[0].nodes.map(n=>[n.name,n]));
const run=(name,input,values={})=>new Function('$','$input','$execution',nodes[name].parameters.jsCode)(name=>({first:()=>({json:values[name]}),item:{json:values[name]},all:()=>(values[name]||[]).map(json=>({json}))}),{first:()=>({json:input}),all:()=>[{json:input}]},{id:'test'});
const cfg=run('Config',{})[0].json;ok(cfg.dryRun&&!cfg.autoPublish);ok(cfg.chatId.includes('REPLACE_'));ok(flows[0].settings.timezone==='Asia/Tehran');
const article={id:1,title:'Central bank holds interest rate at 4 percent',description:'The central bank held its interest rate at 4 percent and explained the outlook for inflation and economic activity.',source:'ECB Press',published_at:new Date().toISOString(),url:'https://example.com/a'};
const result={score:4,confidence:.8,needs_review:false,title_fa:'بانک مرکزی نرخ بهره را ثابت نگه داشت',summary_fa:'بانک مرکزی نرخ بهره را در سطح 4 درصد ثابت نگه داشت.',why_fa:'این تصمیم به سیاست پولی مربوط است.',impacts:[]};
function validate(r,c=cfg){return run('Validate and Format',{text:JSON.stringify(r)},{'Build AI Request':article,Config:c})[0].json}
let v=validate(result);ok(v.status==='preview');ok(!/RSS|AI|شناسه:|اهمیت:/.test(v.text));ok(!v.text.includes('برداشت احتمالی بازار'));ok(v.text.includes(article.url));ok(validate(result,{...cfg,dryRun:false,autoPublish:true}).status==='ready');ok(validate({...result,confidence:.6}).status==='review');ok(validate({...result,summary_fa:'نرخ بهره 99 درصد است.'}).status==='review');ok(validate({...result,score:2}).status==='filtered');ok(run('Validate and Format',{text:'invalid'},{'Build AI Request':article,Config:cfg})[0].json.status==='failed');
const dv={'Reserve Delivery':{id:1}};
ok(run('Delivery Result',{ok:true,result:{message_id:81}},dv)[0].json.status==='sent');ok(run('Delivery Result',{error:'timeout'},dv)[0].json.status==='send_unknown');
const mn=Object.fromEntries(flows[1].nodes.map(n=>[n.name,n]));assert.throws(()=>new Function(mn.Config.parameters.jsCode)(),/confirmSend/);count++;
ok(mn['Reserve Delivery'].parameters.query.includes('id = $2::bigint'));ok(mn['Reserve Delivery'].alwaysOutputData===false);
console.log(`PASS: ${count} assertions. All Code nodes compile. Offline only; no SQL or external API execution.`);
