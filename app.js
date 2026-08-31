import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function link(d){return `<a class="doc" href="article.html?id=${encodeURIComponent(d.id)}"><strong>${esc(d.title)}</strong><span>${esc(d.category)}</span></a>`;}

async function home(){
  const popular=document.querySelector("#popular"); if(!popular) return;
  const {data,error}=await sb.from("documents").select("id,title,category,created_at").order("created_at",{ascending:false}).limit(10);
  popular.innerHTML=error?`<p class="muted">설정을 확인해주세요: ${esc(error.message)}</p>`:data.length?data.map(link).join(""):"<p class='muted'>아직 문서가 없습니다.</p>";
  const cats=document.querySelectorAll("[data-cat]");
  cats.forEach(b=>b.addEventListener("click",async()=>{const {data}=await sb.from("documents").select("id,title,category").eq("category",b.dataset.cat).order("title");document.querySelector("#categoryDocs").innerHTML=data?.length?data.map(link).join(""):`<p class="muted">${b.dataset.cat} 문서가 없습니다.</p>`;}));
  async function search(){const q=document.querySelector("#search").value.trim();if(!q){popular.innerHTML=data?.map(link).join("")||"";return;}const {data:r}=await sb.from("documents").select("id,title,category").ilike("title",`%${q}%`).order("title");popular.innerHTML=r?.length?r.map(link).join(""):"<p class='muted'>검색 결과가 없습니다.</p>";}
  document.querySelector("#searchBtn").onclick=search;document.querySelector("#search").onkeydown=e=>{if(e.key==="Enter")search();};
}
async function article(){
  const box=document.querySelector("#title"); if(!box)return;
  const id=new URLSearchParams(location.search).get("id"); if(!id){box.textContent="문서를 찾을 수 없습니다.";return;}
  const {data,error}=await sb.from("documents").select("*").eq("id",id).single();
  if(error||!data){box.textContent="문서를 찾을 수 없습니다.";return;}
  document.title=data.title+" · 4반 백과";box.textContent=data.title;
  document.querySelector("#meta").textContent=`${data.category} · ${new Date(data.created_at).toLocaleDateString("ko-KR")}`;
  document.querySelector("#content").innerHTML=esc(data.content).replace(/\n/g,"<br>");
}
home();article();
