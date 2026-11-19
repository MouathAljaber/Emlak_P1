/* Admin enquiry dashboard (served at /admin.html). */
(function(){
const key=document.querySelector('#key'),search=document.querySelector('#search'),filter=document.querySelector('#statusFilter'),rows=document.querySelector('#rows'),message=document.querySelector('#message'),total=document.querySelector('#total'),newCount=document.querySelector('#newCount'),doneCount=document.querySelector('#doneCount'),refresh=document.querySelector('#refresh');
let enquiries=[];
const esc=(value)=>String(value??'-').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
function render(){const query=search.value.trim().toLowerCase(),status=filter.value;
const visible=enquiries.filter((item)=>{const hay=[item.club_name,item.contact_person,item.email].join(' ').toLowerCase();
return(!query||hay.includes(query))&&(!status||item.status===status)});
rows.innerHTML=visible.length?visible.map((item)=>`<tr><td>${esc(new Date(item.created_at).toLocaleString())}</td><td><strong>${esc(item.club_name)}</strong><br>${esc(item.contact_person)}<br><a href="mailto:${esc(item.email)}">${esc(item.email)}</a><br>${esc(item.phone)}</td><td>${esc(item.dates)}<br>${esc(item.nights)} nights<br>${esc(item.players)} players / ${esc(item.staff)} staff</td><td>${esc((item.services||[]).join(', '))}</td><td><select data-id="${item.id}">${['new','contacted','closed'].map((status)=>`<option ${status===item.status?'selected':''}>${status}</option>`).join('')}</select></td></tr>`).join(''):'<tr><td class="empty" colspan="5">No matching enquiries.</td></tr>';
rows.querySelectorAll('select').forEach((select)=>select.addEventListener('change',()=>updateStatus(select)));}
function updateStats(){total.textContent=enquiries.length;
newCount.textContent=enquiries.filter((item)=>item.status==='new').length;
doneCount.textContent=enquiries.filter((item)=>item.status!=='new').length}
async function load(){message.className='muted';
message.textContent='Loading…';
let response,data;
try{response=await fetch('/api/admin/enquiries',{headers:{'x-admin-key':key.value}});
data=await response.json().catch(()=>({}));}catch(error){message.className='error';
message.textContent='Network error — is the server running?';
return}if(!response.ok){message.className='error';
message.textContent=data.error||'Unable to load enquiries';
return}enquiries=data;
search.disabled=filter.disabled=refresh.disabled=false;
updateStats();
render();
message.className='success';
message.textContent=`Loaded ${data.length} enquiries.`}
async function updateStatus(select){const response=await fetch('/api/admin/enquiries/'+encodeURIComponent(select.dataset.id),{method:'PATCH',headers:{'Content-Type':'application/json','x-admin-key':key.value},body:JSON.stringify({status:select.value})});
if(!response.ok){message.className='error';
message.textContent='Unable to update enquiry status.';
return}const item=enquiries.find((entry)=>String(entry.id)===select.dataset.id);
if(item)item.status=select.value;
updateStats();
message.className='success';
message.textContent='Status updated.'}
document.querySelector('#load').addEventListener('click',load);
refresh.addEventListener('click',load);
search.addEventListener('input',render);
filter.addEventListener('change',render);
key.addEventListener('keydown',(event)=>{if(event.key==='Enter')load()});
}());
