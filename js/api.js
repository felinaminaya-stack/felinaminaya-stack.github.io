const SUPABASE_URL = "https://xxxx.supabase.co"
// Redacted: do NOT keep secret keys in client-side code. Move this to a backend.
const SUPABASE_KEY = "REDACTED_REMOVE_FROM_CLIENT"

async function obtenerGatos(){

let r = await fetch(
`${SUPABASE_URL}/rest/v1/gatos`,
{
headers:{
apikey: SUPABASE_KEY,
Authorization: `Bearer ${SUPABASE_KEY}`
}
})

return await r.json()

}