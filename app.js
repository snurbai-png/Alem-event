const SUPABASE_URL = 'https://dulfanhffndctpznmfyb.supabase.co/rest/v1/';
const SUPABASE_KEY = 'sb_publishable_JZijzOktaD4oqGPtChle5w_QAnM562L';

const headers = {
  apikey: SUPABASE_KEY,
  'Content-Type': 'application/json'
};

async function findGuest() {
  const q = document.getElementById('q').value.trim();
  const r = document.getElementById('result');

  r.className = 'show';

  if (!q) {
    r.innerHTML = 'Аты-жөніңізді енгізіңіз';
    return;
  }

  r.innerHTML = 'Ізделуде...';

  const params = new URLSearchParams(window.location.search);
  const eventSlug = params.get('event') || 'test-event';

  try {
    const res = await fetch(
    'https://dulfanhffndctpznmfyb.supabase.co/rest/v1/rpc/find_guest',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          p_event_slug: eventSlug,
          p_name: q
        })
      }
    );

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const rows = await res.json();

    if (!rows.length) {
      r.innerHTML =
        'Қонақ табылмады. Аты-жөніңізді дұрыс енгізгеніңізді тексеріңіз.';
      return;
    }

    const guest = rows[0];

  r.innerHTML = `
  <div>Қош келдіңіз, ${guest.full_name}</div>

  <div style="font-size:64px;margin:12px 0;">
    №${guest.table_number}
  </div>

  <div>Сіздің үстеліңіз</div>

  <button
    type="button"
    onclick="document.getElementById('hallMap').style.display='block'"
    style="
      width:100%;
      margin-top:20px;
      padding:16px;
      border:1px solid #89976b;
      border-radius:14px;
      background:white;
      color:#75845c;
      font-size:18px;
      font-weight:bold;
    ">
    Үстелімді картадан көрсету
  </button>

  <div id="hallMap" style="display:none; margin-top:25px;">
    <div style="font-size:28px; margin-bottom:18px;">
      Сіздің үстеліңіз — №${guest.table_number}
    </div>

    <img
      src="hall-plan.png"
      alt="Зал картасы"
      style="width:100%; border-radius:18px;"
    >
  </div>
`;
} catch (error) {
  console.error(error);
  r.innerHTML = 'Қате: ' + error.message;
}
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('findBtn');
  const input = document.getElementById('q');

  if (button) {
    button.addEventListener('click', findGuest);
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') findGuest();
    });
  }
});
