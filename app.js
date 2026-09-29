const SUPABASE_URL='https://dulfanhffndctpznmfyb.supabase.co';
const SUPABASE_KEY='sb_publishable_JZijzOktaD4oqGPtChle5w_QAnM562L';
const headers={
  apikey:SUPABASE_KEY,
  Authorization:`Bearer ${SUPABASE_KEY}`,
  'Content-Type':'application/json'
};

async function findGuest(){
  const q=document.getElementById('q').value.trim();
  const r=document.getElementById('result');
  r.className='show';
  if(!q){r.innerHTML='Аты-жөніңізді енгізіңіз';return;}
  r.innerHTML='Ізделуде…';

  // QR links can use ?event=your-event-slug. For the current test, default to test-event.
  const params=new URLSearchParams(window.location.search);
  const eventSlug=params.get('event') || 'test-event';

  try{
    const res=await fetch(`${SUPABASE_URL}/rest/v1/rpc/find_guest`,{
      method:'POST',
      headers,
      body:JSON.stringify({p_event_slug:eventSlug,p_name:q})
    });
    if(!res.ok) throw new Error(await res.text());
    const rows=await res.json();
    if(!rows.length){
      r.innerHTML='Қонақ табылмады. Аты-жөніңізді толық жазып көріңіз.';
      return;
    }
    const g=rows[0];
    r.innerHTML=`Қош келдіңіз, ${g.full_name}<strong>№${g.table_number}</strong>Сіздің үстеліңіз<button type="button" class="map-btn" onclick="showHallMap('${g.table_number}')">Үстелімді картадан көрсету</button><div id="hallMapHolder"></div>`;
  }catch(e){
    console.error(e);
    r.innerHTML='Дерекқорға қосылу мүмкін болмады. Администраторға хабарласыңыз.';
  }
}

document.getElementById('q')?.addEventListener('keydown',e=>{
  if(e.key==='Enter') findGuest();
});

function hallMapHtml(tableNumber){
 const key=String(tableNumber).replace(/[^0-9]/g,'');
 // Guaranteed web-safe bundled hall plan. This avoids Safari/Storage URL rendering issues.
 const mapUrl=new URL('hall-plan.png', window.location.href).href + '?v=7';
 return `<div class="hall-map" id="hallMap"><h3>Сіздің үстеліңіз — №${key}</h3><div class="hall-canvas"><img src="${mapUrl}" alt="Зал жоспары"></div></div>`;
}
function showHallMap(tableNumber){
 const holder=document.getElementById('hallMapHolder');
 if(!holder) return;
 holder.innerHTML=hallMapHtml(tableNumber);
 holder.scrollIntoView({behavior:'smooth',block:'center'});
}
