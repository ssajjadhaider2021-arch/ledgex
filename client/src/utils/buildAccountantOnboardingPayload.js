import { MAX_FILE_MB } from "../constants/accountantOnboarding";

function readBase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const r = fr.result;
      const i = typeof r === "string" ? r.indexOf(",") : -1;
      resolve(i >= 0 ? r.slice(i + 1) : r);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

export async function buildAccountantOnboardingPayload(values) {
  const maxBytes = MAX_FILE_MB * 1024 * 1024;
  const rawList = values.documents?.fileList ?? values.documents ?? [];
  const docs = [];
  for (const item of rawList) {
    const file = item.originFileObj ?? item;
    if (!file?.size) continue;
    if (file.size > maxBytes) {
      throw new Error(`${file.name} exceeds ${MAX_FILE_MB} MB`);
    }
    docs.push({
      name: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      data: await readBase64(file),
    });
  }
  return {
    fullName: values.fullName?.trim(),
    phoneNumber: values.phoneNumber?.trim(),
    address: values.address?.trim(),
    city: values.city?.trim(),
    country: values.country?.trim(),
    firmName: values.firmName?.trim(),
    qualification: values.qualification?.trim(),
    yearsOfExperience: Number(values.yearsOfExperience),
    registrationNumber: values.registrationNumber?.trim(),
    specializations: values.specializations ?? [],
    documents: docs.length ? docs : null,
  };
}
