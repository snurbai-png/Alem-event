const adminMessages = {
  kk: {
    enterLogin: "Email мен парольді енгізіңіз.",
    loggingIn: "Кіру…",
    wrongLogin: "Email немесе пароль қате.",
    noEvents: "Іс-шара жоқ",
    eventsLoadError: "Іс-шараларды жүктеу мүмкін болмады.",
    enterEventName: "Іс-шара атауын жазыңыз.",
    creating: "Құрылуда…",
    eventCreated: "Іс-шара құрылды ✓",
    currentPlan: "Қазіргі зал жоспары ✓",
    noPlan: "Бұл іс-шараға зал жоспары әлі жүктелмеген.",
    selectEvent: "Алдымен іс-шараны таңдаңыз.",
    selectPlan: "Зал жоспарының суретін таңдаңыз.",
    selectImage: "Сурет файлын таңдаңыз.",
    uploadingPlan: "Зал жоспары жүктелуде…",
    planUploaded: "Зал жоспары сәтті жүктелді ✓",
    linkCopied: "Қонақ сілтемесі көшірілді ✓",
    save: "Сақтау",
    edit: "Өзгерту",
    delete: "Өшіру",
    guestNotFound: "Қонақ табылмады",
    changesSaved: "Өзгеріс сақталды ✓",
    adding: "Қосылуда…",
    guestAdded: "Қонақ қосылды ✓",
    addError: "Қосу мүмкін болмады.",
    chooseExcel: "Excel файлын таңдаңыз.",
    readingFile: "Файл оқылуда…",
    deleteGuest: "Қонақты өшіру керек пе?",
    deleteError: "Өшіру мүмкін болмады."
  },

  ru: {
    enterLogin: "Введите email и пароль.",
    loggingIn: "Вход…",
    wrongLogin: "Неверный email или пароль.",
    noEvents: "Нет мероприятий",
    eventsLoadError: "Не удалось загрузить мероприятия.",
    enterEventName: "Введите название мероприятия.",
    creating: "Создание…",
    eventCreated: "Мероприятие создано ✓",
    currentPlan: "Текущий план зала ✓",
    noPlan: "Для этого мероприятия план зала ещё не загружен.",
    selectEvent: "Сначала выберите мероприятие.",
    selectPlan: "Выберите изображение плана зала.",
    selectImage: "Выберите файл изображения.",
    uploadingPlan: "План зала загружается…",
    planUploaded: "План зала успешно загружен ✓",
    linkCopied: "Ссылка для гостей скопирована ✓",
    save: "Сохранить",
    edit: "Изменить",
    delete: "Удалить",
    guestNotFound: "Гость не найден",
    changesSaved: "Изменения сохранены ✓",
    adding: "Добавление…",
    guestAdded: "Гость добавлен ✓",
    addError: "Не удалось добавить.",
    chooseExcel: "Выберите файл Excel.",
    readingFile: "Чтение файла…",
    deleteGuest: "Удалить гостя?",
    deleteError: "Не удалось удалить."
  },

  en: {
    enterLogin: "Enter your email and password.",
    loggingIn: "Logging in…",
    wrongLogin: "Incorrect email or password.",
    noEvents: "No events",
    eventsLoadError: "Unable to load events.",
    enterEventName: "Enter the event name.",
    creating: "Creating…",
    eventCreated: "Event created ✓",
    currentPlan: "Current floor plan ✓",
    noPlan: "No floor plan has been uploaded for this event yet.",
    selectEvent: "Select an event first.",
    selectPlan: "Select a floor plan image.",
    selectImage: "Select an image file.",
    uploadingPlan: "Uploading floor plan…",
    planUploaded: "Floor plan uploaded successfully ✓",
    linkCopied: "Guest link copied ✓",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    guestNotFound: "Guest not found",
    changesSaved: "Changes saved ✓",
    adding: "Adding…",
    guestAdded: "Guest added ✓",
    addError: "Unable to add guest.",
    chooseExcel: "Select an Excel file.",
    readingFile: "Reading file…",
    deleteGuest: "Delete this guest?",
    deleteError: "Unable to delete."
  }
};

function msg(key) {
  const lang = localStorage.getItem("alem_admin_language") ||
               localStorage.getItem("alem_language") ||
               "kk";

  return adminMessages[lang]?.[key] || adminMessages.kk[key] || "";
}
const SUPABASE_URL='https://dulfanhffndctpznmfyb.supabase.co';
const SUPABASE_KEY='sb_publishable_JZijzOktaD4oqGPtChle5w_QAnM562L';
let accessToken=sessionStorage.getItem('alem_admin_token')||'';
let events=[],eventId=null,currentEvent=null,guestRows=[];
const $=id=>document.getElementById(id);
function apiHeaders(extra={}){return {apikey:SUPABASE_KEY,Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json',...extra}}
function setView(loggedIn){$('loginCard').style.display=loggedIn?'none':'block';$('adminPanel').style.display=loggedIn?'block':'none'}
async function login(){const email=$('email').value.trim(),password=$('password').value;if(!email||!password){$('loginMsg').textContent='Email мен парольді енгізіңіз.';return}$('loginBtn').disabled=true;$('loginMsg').textContent='Кіру…';try{const res=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const data=await res.json();if(!res.ok||!data.access_token)throw new Error();accessToken=data.access_token;sessionStorage.setItem('alem_admin_token',accessToken);setView(true);await loadEvents()}catch(e){$('loginMsg').textContent='Email немесе пароль қате.'}finally{$('loginBtn').disabled=false}}
function logout(){sessionStorage.removeItem('alem_admin_token');accessToken='';eventId=null;currentEvent=null;setView(false);$('password').value=''}
function slugify(s){return s.toLowerCase().trim().replace(/[ә]/g,'a').replace(/[ғ]/g,'g').replace(/[қ]/g,'q').replace(/[ң]/g,'n').replace(/[ө]/g,'o').replace(/[ұү]/g,'u').replace(/[һ]/g,'h').replace(/[і]/g,'i').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)}
async function loadEvents(){try{const r=await fetch(`${SUPABASE_URL}/rest/v1/events?select=id,name,event_date,slug&order=created_at.desc`,{headers:apiHeaders()});if(r.status===401){logout();return}if(!r.ok)throw new Error(await r.text());events=await r.json();$('eventSelect').innerHTML=events.length?events.map(e=>`<option value="${e.id}">${esc(e.name)}${e.event_date?' · '+e.event_date:''}</option>`).join(''):'<option value="">Іс-шара жоқ</option>';if(events.length){const saved=Number(sessionStorage.getItem('alem_event_id'));const found=events.find(e=>e.id===saved)||events[0];$('eventSelect').value=found.id;await chooseEvent(found)}else{$('eventTools').style.display='none'}}catch(e){console.error(e);$('eventMsg').textContent='Іс-шараларды жүктеу мүмкін болмады.'}}
async function createEvent(){const name=$('eventName').value.trim(),date=$('eventDate').value.trim();if(!name){$('eventMsg').textContent='Іс-шара атауын жазыңыз.';return}const slug='event-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);$('eventMsg').textContent='Құрылуда…';try{const r=await fetch(`${SUPABASE_URL}/rest/v1/events`,{method:'POST',headers:apiHeaders({Prefer:'return=representation','Accept':'application/json'}),body:JSON.stringify({name:name,event_date:date||null,slug:slug})});const raw=await r.text();if(!r.ok){let detail=raw;try{const j=JSON.parse(raw);detail=j.message||j.details||raw}catch{}throw new Error(detail)}const rows=raw?JSON.parse(raw):[];const e=rows[0];if(!e||!e.id)throw new Error('Жаңа іс-шараның ID нөмірі алынбады');$('eventName').value='';$('eventDate').value='';$('eventMsg').textContent='Іс-шара құрылды ✓';sessionStorage.setItem('alem_event_id',e.id);await loadEvents()}catch(e){console.error(e);$('eventMsg').textContent='Құру қатесі: '+(e.message||'Белгісіз қате')}}
async function selectEvent(){const id=Number($('eventSelect').value);const e=events.find(x=>x.id===id);if(e)await chooseEvent(e)}
async function chooseEvent(e){currentEvent=e;eventId=e.id;sessionStorage.setItem('alem_event_id',e.id);$('eventTools').style.display='block';$('currentEventName').textContent=e.name;$('currentEventMeta').textContent=(e.event_date?e.event_date+' · ':'')+'Код: '+e.slug;makeQR();loadHallPlanPreview();await loadGuests()}

function hallPlanPath(){return currentEvent?.slug?encodeURIComponent(currentEvent.slug):''}
function hallPlanPublicUrl(){const p=hallPlanPath();return p?`${SUPABASE_URL}/storage/v1/object/public/hall-plans/${p}`:''}
function loadHallPlanPreview(){
  const wrap=$('hallPlanPreview'),img=$('hallPlanPreviewImg'),msg=$('hallPlanMsg');
  if(!wrap||!img||!currentEvent)return;
  const url=hallPlanPublicUrl()+`?v=${Date.now()}`;
  img.onload=()=>{wrap.style.display='block';if(msg)msg.textContent='Қазіргі зал жоспары ✓'};
  img.onerror=()=>{wrap.style.display='none';if(msg)msg.textContent='Бұл іс-шараға зал жоспары әлі жүктелмеген.'};
  img.src=url;
}
async function uploadHallPlan(){
  const file=$('hallPlanFile')?.files?.[0];
  const msg=$('hallPlanMsg');
  if(!currentEvent||!eventId){msg.textContent='Алдымен іс-шараны таңдаңыз.';return}
  if(!file){msg.textContent='Зал жоспарының суретін таңдаңыз.';return}
  if(!file.type.startsWith('image/')){msg.textContent='Сурет файлын таңдаңыз.';return}
  // HEIC/HEIF зал жоспарлары кей браузерлерде қонақ бетінде ашылмайды.
  // Сондықтан вебке сенімді JPG/PNG/WebP форматтарын ғана сақтаймыз.
  const name=(file.name||'').toLowerCase();
  const isHeic=file.type==='image/heic'||file.type==='image/heif'||name.endsWith('.heic')||name.endsWith('.heif');
  if(isHeic){msg.textContent='HEIC форматы сайтта тұрақты ашылмайды. Фотоны JPG немесе PNG форматында таңдаңыз.';return}
  const allowed=['image/jpeg','image/png','image/webp'];
  if(file.type && !allowed.includes(file.type)){msg.textContent='JPG, PNG немесе WebP суретін таңдаңыз.';return}
  msg.textContent='Зал жоспары жүктелуде…';
  try{
    const r=await fetch(`${SUPABASE_URL}/storage/v1/object/hall-plans/${hallPlanPath()}`,{
      method:'POST',
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${accessToken}`,'Content-Type':file.type||'image/jpeg','Cache-Control':'3600','x-upsert':'true'},
      body:file
    });
    if(!r.ok)throw new Error(await r.text());
    $('hallPlanFile').value='';
    msg.textContent='Зал жоспары сәтті жүктелді ✓';
    loadHallPlanPreview();
  }catch(e){console.error(e);msg.textContent='Жүктеу мүмкін болмады. Storage UPDATE рұқсаты қажет болуы мүмкін.'}
}

function guestUrl(){return `${location.origin}${location.pathname.replace(/admin\.html.*$/,'index.html')}?event=${encodeURIComponent(currentEvent.slug)}`}
function makeQR(){const box=$('qrcode');box.innerHTML='';new QRCode(box,{text:guestUrl(),width:190,height:190,correctLevel:QRCode.CorrectLevel.M})}
async function copyGuestLink(){try{await navigator.clipboard.writeText(guestUrl());$('eventMsg').textContent='Қонақ сілтемесі көшірілді ✓'}catch(e){prompt('Сілтемені көшіріңіз:',guestUrl())}}
function downloadQR(){const img=$('qrcode').querySelector('img');const canvas=$('qrcode').querySelector('canvas');const src=img?.src||canvas?.toDataURL('image/png');if(!src)return;const a=document.createElement('a');a.href=src;a.download=`ALEM_EVENT_${currentEvent.slug}_QR.png`;a.click()}
async function deleteEvent(){
  if(!currentEvent||!eventId)return;
  const ok=confirm(`«${currentEvent.name}» іс-шарасын өшіру керек пе?\n\nОсы іс-шарадағы барлық қонақ та өшеді. Бұл әрекетті қайтару мүмкін емес.`);
  if(!ok)return;
  const msg=$('deleteEventMsg');
  msg.textContent='Іс-шара өшірілуде…';
  try{
    const r=await fetch(`${SUPABASE_URL}/rest/v1/events?id=eq.${eventId}`,{method:'DELETE',headers:apiHeaders()});
    if(!r.ok)throw new Error(await r.text());
    sessionStorage.removeItem('alem_event_id');
    eventId=null;currentEvent=null;
    $('eventTools').style.display='none';
    $('eventMsg').textContent='Іс-шара және оның қонақтары өшірілді ✓';
    await loadEvents();
  }catch(e){console.error(e);msg.textContent='Іс-шараны өшіру мүмкін болмады.'}
}
async function loadGuests(){try{const r=await fetch(`${SUPABASE_URL}/rest/v1/guests?event_id=eq.${eventId}&select=id,full_name,table_number&order=table_number.asc,full_name.asc`,{headers:apiHeaders()});if(!r.ok)throw new Error(await r.text());guestRows=await r.json();render(guestRows);filterGuests()}catch(e){console.error(e);$('list').innerHTML='<div class="admin-msg pad">Қонақтар тізімін жүктеу мүмкін болмады.</div>'}}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function render(rows){
  $('guestCount').textContent=`(${guestRows.length})`;
  $('list').innerHTML=rows.length?rows.map(x=>`<div class="guest-row" id="guest-${Number(x.id)}"><div class="guest-info"><span>${esc(x.full_name)} <b>№${esc(x.table_number)}</b></span><div class="edit-panel" id="edit-${Number(x.id)}"><input id="edit-name-${Number(x.id)}" value="${esc(x.full_name)}" aria-label="Аты-жөні"><input id="edit-table-${Number(x.id)}" value="${esc(x.table_number)}" aria-label="Үстел №"><button onclick="saveGuest(${Number(x.id)})">Сақтау</button></div></div><div class="guest-actions"><button class="edit-btn" onclick="toggleEdit(${Number(x.id)})">Өзгерту</button><button onclick="removeGuest(${Number(x.id)})">Өшіру</button></div></div>`).join(''):'<div class="empty">Қонақ табылмады</div>'
}
function filterGuests(){
  const el=$('guestSearch'); if(!el)return;
  const q=el.value.trim().toLocaleLowerCase('kk-KZ');
  const rows=q?guestRows.filter(x=>String(x.full_name).toLocaleLowerCase('kk-KZ').includes(q)):guestRows;
  render(rows);
  $('searchMsg').textContent=q?`${rows.length} қонақ табылды`:'';
}
function toggleEdit(id){const p=$(`edit-${id}`);if(p)p.classList.toggle('open')}
async function saveGuest(id){
  const name=$(`edit-name-${id}`)?.value.trim(),table=$(`edit-table-${id}`)?.value.trim();
  if(!name||!table){alert('Аты-жөні мен үстел нөмірін толтырыңыз.');return}
  try{
    const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_update_guest`,{method:'POST',headers:apiHeaders(),body:JSON.stringify({p_guest_id:id,p_event_id:eventId,p_full_name:name,p_table_number:table})});
    if(!r.ok)throw new Error(await r.text());
    const result=await r.json();
    if(result!==true)throw new Error('Қонақ табылмады немесе өзгеріс сақталмады');
    $('searchMsg').textContent='Өзгеріс сақталды ✓';
    await loadGuests();
  }catch(e){console.error(e);alert('Өзгерісті сақтау мүмкін болмады.')}
}
async function addGuest(){const name=$('n').value.trim(),table=$('t').value.trim();if(!name||!table||!eventId){$('actionMsg').textContent='Аты-жөні мен үстел нөмірін толтырыңыз.';return}$('actionMsg').textContent='Қосылуда…';try{await insertGuests([{event_id:eventId,full_name:name,table_number:table}]);$('n').value='';$('t').value='';$('actionMsg').textContent='Қонақ қосылды ✓';await loadGuests()}catch(e){console.error(e);$('actionMsg').textContent='Қосу мүмкін болмады.'}}
async function insertGuests(rows){for(let i=0;i<rows.length;i+=200){const r=await fetch(`${SUPABASE_URL}/rest/v1/guests`,{method:'POST',headers:apiHeaders({Prefer:'return=minimal'}),body:JSON.stringify(rows.slice(i,i+200))});if(!r.ok)throw new Error(await r.text())}}
function pick(obj,names){const keys=Object.keys(obj);for(const n of names){const k=keys.find(x=>x.toLowerCase().replace(/\s/g,'')===n.toLowerCase().replace(/\s/g,''));if(k!=null&&obj[k]!=null&&String(obj[k]).trim()!=='')return String(obj[k]).trim()}return ''}
async function importExcel(){const file=$('excelFile').files[0];if(!file){$('importMsg').textContent='Excel файлын таңдаңыз.';return}if(!eventId)return;$('importMsg').textContent='Файл оқылуда…';try{const data=await file.arrayBuffer();const wb=XLSX.read(data,{type:'array'});const sheet=wb.Sheets[wb.SheetNames[0]];const raw=XLSX.utils.sheet_to_json(sheet,{defval:''});const rows=raw.map(o=>({event_id:eventId,full_name:pick(o,['Аты-жөні','Аты жөні','аты-жөні','full_name','name','ФИО','Қонақ']),table_number:pick(o,['Үстел №','Үстел','үстел №','table_number','table','Стол','Стол №'])})).filter(x=>x.full_name&&x.table_number);if(!rows.length)throw new Error('Бағандар табылмады');$('importMsg').textContent=`${rows.length} қонақ табылды. Жүктелуде…`;await insertGuests(rows);$('excelFile').value='';$('importMsg').textContent=`${rows.length} қонақ сәтті қосылды ✓`;await loadGuests()}catch(e){console.error(e);$('importMsg').textContent='Файлды оқу мүмкін болмады. Бағандар «Аты-жөні» және «Үстел №» болсын.'}}
async function removeGuest(id){if(!confirm('Қонақты өшіру керек пе?'))return;try{const r=await fetch(`${SUPABASE_URL}/rest/v1/guests?id=eq.${id}&event_id=eq.${eventId}`,{method:'DELETE',headers:apiHeaders()});if(!r.ok)throw new Error(await r.text());await loadGuests()}catch(e){alert('Өшіру мүмкін болмады.')}}
$('password')?.addEventListener('keydown',e=>{if(e.key==='Enter')login()});$('eventCreateForm')?.addEventListener('submit',e=>{e.preventDefault();createEvent()});if(accessToken){setView(true);loadEvents()}else setView(false);
