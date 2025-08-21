// Define default steps, then allow partner-specific overrides
const DEFAULT_STEPS = ['KYC','Bureau','Credit','Sanction','Documentation','Disbursement'];


// Example: store JSON in partners.process_json (DB) like:
// { "steps": ["KYC","Bureau","Sanction","Documentation","Disbursement"], "rules": {"KYC":{"provider":"Perfios"}} }


async function getProcessForPartner(partner) {
const cfg = partner?.process_json || {};
const steps = cfg.steps && Array.isArray(cfg.steps) && cfg.steps.length ? cfg.steps : DEFAULT_STEPS;
return { steps, rules: cfg.rules || {} };
}


module.exports = { getProcessForPartner };