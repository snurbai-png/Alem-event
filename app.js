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
    'https://dulfanhffndctpznmfyb.supabase.co/rest/v1/rpc/find_guest'
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
      <div style="font-size:64px;margin:12px 0;">№${guest.table_number}</div>
      <div>Сіздің үстеліңіз</div>
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
