import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
const sb=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const $=s=>document.querySelector(s); const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function msg(t,ok=false){$("#loginMsg").textContent=t;$("#saveMsg").textContent=t;[...document.querySelectorAll(".msg")].forEach(x=>x.className="msg "+(ok?"ok":""));}

async function renderDocs(){
 const {data}=await sb.from("documents").select("*").order("created_at",{ascending:false});
 $("#adminDocs").innerHTML=data?.length?data.map(d=>`<div class="admin-doc"><div><strong>${esc(d.title)}</strong><span>${esc(d.category)}</span></div><div><button data-edit="${d.id}">편집</button><button data-del="${d.id}" class="danger">삭제</button></div></div>`).join(""):"<p class='muted'>문서가 없습니다.</p>";
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));
 document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>del(b.dataset.del));
}
async function edit(id){const {data}=await sb.from("documents").select("*").eq("id",id).single();if(!data)return;$("#docId").value=data.id;$("#docTitle").value=data.title;$("#docCategory").value=data.category;$("#docContent").value=data.content;window.scrollTo({top:0,behavior:"smooth"});}
async function del(id){if(!confirm("이 문서를 삭제할까요?"))return;const {error}=await sb.from("documents").delete().eq("id",id);if(error)msg(error.message);else{msg("삭제했습니다.",true);renderDocs();}}
$("#loginBtn").onclick=async()=>{const {data,error}=await sb.auth.signInWithPassword({email:$("#email").value,password:$("#password").value});if(error)msg("로그인 실패: "+error.message);else show(data.user);};
$("#logoutBtn").onclick=async()=>{await sb.auth.signOut();location.reload();};
$("#newBtn").onclick=()=>{$("#docId").value="";$("#docTitle").value="";$("#docCategory").value="밈";$("#docContent").value="";$("#saveMsg").textContent="새 문서 작성 중";};
$("#saveBtn").onclick=async()=>{
 const user=(await sb.auth.getUser()).data.user;if(!user){msg("로그인이 필요합니다.");return;}
 const title=$("#docTitle").value.trim(),category=$("#docCategory").value,content=$("#docContent").value.trim(),id=$("#docId").value;
 if(!title||!content){$("#saveMsg").textContent="제목과 내용을 입력하세요.";return;}
 let res=id?await sb.from("documents").update({title,category,content}).eq("id",id):await sb.from("documents").insert({title,category,content,author_id:user.id});
 if(res.error)$("#saveMsg").textContent="저장 실패: "+res.error.message;else{$("#saveMsg").textContent="저장했습니다.";renderDocs();}
};
async function show(user){$("#loginPanel").classList.add("hidden");$("#editorPanel").classList.remove("hidden");$("#who").textContent=user.email+" 로그인됨";renderDocs();}
const {data:{user}}=await sb.auth.getUser();if(user)show(user);
