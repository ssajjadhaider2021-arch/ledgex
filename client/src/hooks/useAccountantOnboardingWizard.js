import { useState, useCallback } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  saveAccountantAmlStep,
  saveAccountantDataProtectionStep,
  saveAccountantDeclarationsStep,
  saveAccountantInsuranceStep,
  saveAccountantProfessionalStep,
  saveAccountantProfileStep,
} from "../api/accountant.api";

const STEP_FIELDS = [
  [
    "legal_name",
    "company_number_or_utr",
    "trading_name",
    "address_line1",
    "address_line2",
    "city",
    "postcode",
    "contact_name",
    "contact_email",
    "contact_phone",
  ],
  ["professional_body", "membership_number", "is_good_standing", "services"],
  ["aml_registration_number", "mlr_compliant", "sanctions_pep_check", "aml_supervision_file", "aml_policy_file", "risk_assessment_file"],
  ["insurance_certificate_file"],
  ["ico_registration_number", "gdpr_compliant"],
  ["accept_moa", "accept_dpa", "accept_regulatory"],
];

export function useAccountantOnboardingWizard(form) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();

  const getCurrentStepFields = useCallback(() => STEP_FIELDS[step] ?? [], [step]);

  const checkStepValidity = useCallback(async () => {
    if (step === 0) {
      const values = form.getFieldsValue([
        "legal_name",
        "company_number_or_utr",
        "address_line1",
        "city",
        "postcode",
        "contact_name",
        "contact_email",
        "contact_phone",
      ]);
      const legalNameOk = typeof values.legal_name === "string" && values.legal_name.trim().length > 0;
      const companyOk =
        typeof values.company_number_or_utr === "string" &&
        values.company_number_or_utr.trim().length > 0 &&
        values.company_number_or_utr.trim().length <= 10;
      const addressOk = typeof values.address_line1 === "string" && values.address_line1.trim().length > 0;
      const cityOk = typeof values.city === "string" && values.city.trim().length > 0;
      const postcodeOk = typeof values.postcode === "string" && values.postcode.trim().length > 0;
      const contactNameOk = typeof values.contact_name === "string" && values.contact_name.trim().length > 0;
      const emailOk =
        typeof values.contact_email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact_email.trim());
      const phoneOk =
        typeof values.contact_phone === "string" &&
        /^\+[1-9]\d{7,14}$/.test(values.contact_phone.trim());
      const allValid = legalNameOk && companyOk && addressOk && cityOk && postcodeOk && contactNameOk && emailOk && phoneOk;
      setCanProceed(allValid);
      return allValid;
    }

    if (step === 1) {
      const values = form.getFieldsValue(["professional_body", "membership_number", "is_good_standing", "services"]);
      const professionalBodyOk = Boolean(values.professional_body);
      const membershipOk = typeof values.membership_number === "string" && values.membership_number.trim().length > 0;
      const goodStandingOk = values.is_good_standing === true;
      const servicesOk = Array.isArray(values.services) && values.services.length > 0;
      const allValid = professionalBodyOk && membershipOk && goodStandingOk && servicesOk;
      setCanProceed(allValid);
      return allValid;
    }

    if (step === 2) {
      const values = form.getFieldsValue([
        "aml_registration_number",
        "mlr_compliant",
        "sanctions_pep_check",
        "aml_supervision_file",
        "aml_policy_file",
        "risk_assessment_file",
      ]);
      const amlRegOk = typeof values.aml_registration_number === "string" && values.aml_registration_number.trim().length > 0;
      const mlrOk = values.mlr_compliant === true;
      const sanctionsOk = values.sanctions_pep_check === true;
      const amlSupervisionOk = Array.isArray(values.aml_supervision_file) && values.aml_supervision_file.length > 0;
      const amlPolicyOk = Array.isArray(values.aml_policy_file) && values.aml_policy_file.length > 0;
      const riskAssessmentOk = Array.isArray(values.risk_assessment_file) && values.risk_assessment_file.length > 0;
      const allValid = amlRegOk && mlrOk && sanctionsOk && amlSupervisionOk && amlPolicyOk && riskAssessmentOk;
      setCanProceed(allValid);
      return allValid;
    }

    if (step === 3) {
      const values = form.getFieldsValue(["insurance_certificate_file"]);
      const insuranceOk =
        Array.isArray(values.insurance_certificate_file) && values.insurance_certificate_file.length > 0;
      setCanProceed(insuranceOk);
      return insuranceOk;
    }

    if (step === 4) {
      const values = form.getFieldsValue(["ico_registration_number", "gdpr_compliant"]);
      const icoOk =
        typeof values.ico_registration_number === "string" && values.ico_registration_number.trim().length > 0;
      const gdprOk = values.gdpr_compliant === true;
      const allValid = icoOk && gdprOk;
      setCanProceed(allValid);
      return allValid;
    }

    if (step === 5) {
      const values = form.getFieldsValue(["accept_moa", "accept_dpa", "accept_regulatory"]);
      const allValid =
        values.accept_moa === true && values.accept_dpa === true && values.accept_regulatory === true;
      setCanProceed(allValid);
      return allValid;
    }

    const fields = getCurrentStepFields();
    if (!fields.length) {
      setCanProceed(true);
      return true;
    }
    try {
      await form.validateFields(fields, { validateOnly: true });
      setCanProceed(true);
      return true;
    } catch {
      setCanProceed(false);
      return false;
    }
  }, [form, getCurrentStepFields]);

  const toFormData = useCallback((obj) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          fd.append(key, item);
        });
        return;
      }
      fd.append(key, value);
    });
    return fd;
  }, []);

  const saveStep = useCallback(
    async (targetStep) => {
      const values = form.getFieldsValue(true);
      if (targetStep === 0) {
        await saveAccountantProfileStep({
          legal_name: values.legal_name,
          trading_name: values.trading_name,
          company_number_or_utr: values.company_number_or_utr,
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          postcode: values.postcode,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
        });
        return;
      }
      if (targetStep === 1) {
        await saveAccountantProfessionalStep({
          professional_body: values.professional_body,
          membership_number: values.membership_number,
          is_good_standing: values.is_good_standing,
          services: values.services || [],
        });
        return;
      }
      if (targetStep === 2) {
        const amlFormData = toFormData({
          aml_registration_number: values.aml_registration_number,
          mlr_compliant: values.mlr_compliant,
          sanctions_pep_check: values.sanctions_pep_check,
          aml_supervision_file: values.aml_supervision_file?.[0]?.originFileObj,
          aml_policy_file: values.aml_policy_file?.[0]?.originFileObj,
          risk_assessment_file: values.risk_assessment_file?.[0]?.originFileObj,
        });
        await saveAccountantAmlStep(amlFormData);
        return;
      }
      if (targetStep === 3) {
        const insuranceFormData = toFormData({
          insurance_certificate_file: values.insurance_certificate_file?.[0]?.originFileObj,
        });
        await saveAccountantInsuranceStep(insuranceFormData);
        return;
      }
      if (targetStep === 4) {
        await saveAccountantDataProtectionStep({
          ico_registration_number: values.ico_registration_number,
          gdpr_compliant: values.gdpr_compliant,
        });
        return;
      }
      if (targetStep === 5) {
        await saveAccountantDeclarationsStep({
          accept_moa: values.accept_moa,
          accept_dpa: values.accept_dpa,
          accept_regulatory: values.accept_regulatory,
        });
      }
    },
    [form, toFormData]
  );

  const onValuesChange = useCallback(() => {
    checkStepValidity();
  }, [checkStepValidity]);

  const next = useCallback(async () => {
    await form.validateFields(STEP_FIELDS[step]);
    setLoading(true);
    try {
      await saveStep(step);
      setStep((s) => Math.min(s + 1, 5));
      message.success("Step saved");
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Could not save this step");
    } finally {
      setLoading(false);
      setTimeout(() => checkStepValidity(), 0);
    }
  }, [checkStepValidity, form, saveStep, step]);

  const back = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
    setTimeout(() => checkStepValidity(), 0);
  }, [checkStepValidity]);

  const submit = useCallback(async () => {
    await form.validateFields(STEP_FIELDS[5]);
    setLoading(true);
    try {
      await saveStep(5);
      message.success("Declarations saved. Continue with verification document upload.");
      navigate("/accountant/verification-documents");
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Submission failed");
    } finally {
      setLoading(false);
      setTimeout(() => checkStepValidity(), 0);
    }
  }, [checkStepValidity, form, navigate, saveStep]);

  return {
    step,
    loading,
    next,
    back,
    submit,
    canProceed,
    onValuesChange,
    checkStepValidity,
  };
}
