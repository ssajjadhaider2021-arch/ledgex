import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  EyeOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../api/auth.api";
import {
  approveAccountant,
  getAccountantById,
  listAccountants,
  rejectAccountant,
} from "../../api/admin.api";
import { useAuth } from "../../contexts/AuthContext";

function apiOrigin() {
  const base = axiosInstance.defaults.baseURL || "";
  return base.replace(/\/api\/?$/i, "") || "http://localhost:5000";
}

function fileHref(path) {
  if (!path || typeof path !== "string") return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = apiOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

const VERIFICATION_DOC_KEYS = [
  ["passport_or_license", "Passport or driving licence"],
  ["proof_of_address", "Proof of address"],
  ["qualification_certificate", "Qualification certificate"],
  ["insurance_certificate", "Insurance certificate"],
  ["firm_registration_doc", "Firm registration"],
  ["practice_license", "Practice licence"],
  ["bank_statement", "Bank statement"],
  ["aml_supervision_doc", "AML supervision"],
];

function statusTag(status) {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") return <Tag color="success">{status}</Tag>;
  if (s === "REJECTED") return <Tag color="error">{status}</Tag>;
  if (s === "PENDING") return <Tag color="processing">{status}</Tag>;
  return <Tag>{status || "—"}</Tag>;
}

export default function AdminAccountantsPage() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectProfileId, setRejectProfileId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listAccountants();
      setRows(Array.isArray(data.accountants) ? data.accountants : []);
    } catch (e) {
      message.error(e?.response?.data?.message || "Could not load accountants");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const openDetail = useCallback(async (profileId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailRecord(null);
    try {
      const { data } = await getAccountantById(profileId);
      setDetailRecord(data.accountant ?? null);
    } catch (e) {
      message.error(e?.response?.data?.message || "Could not load details");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailRecord(null);
  }, []);

  const handleApprove = useCallback(
    async (profileId) => {
      Modal.confirm({
        title: "Approve accountant?",
        content: "They will be able to access the accountant dashboard.",
        okText: "Approve",
        okButtonProps: { icon: <CheckOutlined /> },
        onOk: async () => {
          setActionLoading(true);
          try {
            await approveAccountant(profileId);
            message.success("Accountant approved");
            await loadList();
            if (detailOpen && detailRecord?.id === profileId) {
              const { data } = await getAccountantById(profileId);
              setDetailRecord(data.accountant ?? null);
            }
          } catch (e) {
            message.error(e?.response?.data?.message || "Approve failed");
          } finally {
            setActionLoading(false);
          }
        },
      });
    },
    [loadList, detailOpen, detailRecord]
  );

  const openReject = useCallback((profileId) => {
    setRejectProfileId(profileId);
    setRejectReason("");
    setRejectOpen(true);
  }, []);

  const confirmReject = useCallback(async () => {
    if (rejectProfileId == null) return;
    const pid = rejectProfileId;
    setActionLoading(true);
    try {
      await rejectAccountant(pid, rejectReason.trim() || undefined);
      message.success("Accountant rejected");
      setRejectOpen(false);
      setRejectProfileId(null);
      await loadList();
      if (detailOpen && detailRecord?.id === pid) {
        closeDetail();
      }
    } catch (e) {
      message.error(e?.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  }, [rejectProfileId, rejectReason, loadList, detailOpen, detailRecord, closeDetail]);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        key: "name",
        render: (_, record) =>
          (
            <div className="flex flex-col">
              <span className="font-medium text-slate-800">
                {record.User?.fullName || record.contact_name || record.legal_name || "—"}
              </span>
              <span className="text-xs text-slate-500">{record.legal_name || "No legal name"}</span>
            </div>
          ),
      },
      {
        title: "Email",
        key: "email",
        render: (_, record) => record.User?.email || "—",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (s) => statusTag(s),
      },
      {
        title: "Created at",
        dataIndex: "createdAt",
        key: "createdAt",
        render: formatDateTime,
      },
      {
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 260,
        render: (_, record) => {
          const pending = record.status === "PENDING";
          return (
            <Space size="small" wrap>
              <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => openDetail(record.id)}>
                View
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                disabled={!pending || actionLoading}
                onClick={() => handleApprove(record.id)}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                size="small"
                icon={<CloseOutlined />}
                disabled={!pending || actionLoading}
                onClick={() => openReject(record.id)}
              >
                Reject
              </Button>
            </Space>
          );
        },
      },
    ],
    [openDetail, handleApprove, openReject, actionLoading]
  );

  const user = detailRecord?.User;
  const documents = user?.accountantDocuments || [];
  const compliance = user?.accountantCompliance;
  const verificationDocs =
    user?.AccountantVerificationDocuments || user?.accountantVerificationDocuments;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return rows;
    return rows.filter((row) => {
      const name = row.User?.fullName || row.contact_name || row.legal_name || "";
      const email = row.User?.email || "";
      const status = row.status || "";
      return (
        name.toLowerCase().includes(normalizedQuery) ||
        email.toLowerCase().includes(normalizedQuery) ||
        status.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [rows, normalizedQuery]);
  const counts = useMemo(() => {
    const seed = { total: rows.length, pending: 0, approved: 0, rejected: 0 };
    for (const row of rows) {
      const s = String(row.status || "").toUpperCase();
      if (s === "PENDING") seed.pending += 1;
      if (s === "APPROVED") seed.approved += 1;
      if (s === "REJECTED") seed.rejected += 1;
    }
    return seed;
  }, [rows]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <header className="border-b border-slate-200/80 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <Typography.Text type="secondary" className="text-xs font-semibold uppercase tracking-[0.18em]">
              Admin
            </Typography.Text>
            <Typography.Title level={3} className="!mb-0 !mt-1">
              Accountants Review Center
            </Typography.Title>
          </div>
          <Space>
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Button icon={<LogoutOutlined />} onClick={() => logout()}>
              Sign out
            </Button>
          </Space>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card bordered={false} className="shadow-sm shadow-slate-900/5">
            <Typography.Text type="secondary">Total accountants</Typography.Text>
            <Typography.Title level={3} className="!mb-0 !mt-1">
              {counts.total}
            </Typography.Title>
          </Card>
          <Card bordered={false} className="shadow-sm shadow-slate-900/5">
            <Typography.Text type="secondary">Pending</Typography.Text>
            <Typography.Title level={3} className="!mb-0 !mt-1 !text-sky-600">
              {counts.pending}
            </Typography.Title>
          </Card>
          <Card bordered={false} className="shadow-sm shadow-slate-900/5">
            <Typography.Text type="secondary">Approved</Typography.Text>
            <Typography.Title level={3} className="!mb-0 !mt-1 !text-emerald-600">
              {counts.approved}
            </Typography.Title>
          </Card>
          <Card bordered={false} className="shadow-sm shadow-slate-900/5">
            <Typography.Text type="secondary">Rejected</Typography.Text>
            <Typography.Title level={3} className="!mb-0 !mt-1 !text-rose-600">
              {counts.rejected}
            </Typography.Title>
          </Card>
        </div>

        <Card bordered={false} className="shadow-sm shadow-slate-900/5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Typography.Title level={5} className="!m-0">
              Accountant Applications
            </Typography.Title>
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Search by name, email, or status"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="sm:!w-80"
            />
          </div>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filteredRows}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 900 }}
            rowClassName="hover:!bg-slate-50"
          />
        </Card>
      </main>

      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {(user?.fullName || detailRecord?.contact_name || detailRecord?.legal_name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <Typography.Text className="!block !text-xs !uppercase !tracking-[0.16em] !text-slate-500">
                Accountant details
              </Typography.Text>
              <Typography.Text className="!text-base !font-semibold !text-slate-900">
                {user?.fullName || detailRecord?.contact_name || detailRecord?.legal_name || "Accountant"}
              </Typography.Text>
            </div>
          </div>
        }
        open={detailOpen}
        onCancel={closeDetail}
        width={860}
        styles={{ body: { paddingTop: 8 } }}
        footer={[
          <Button key="close" onClick={closeDetail}>
            Close
          </Button>,
          detailRecord ? (
            <Button
              key="approve"
              type="primary"
              icon={<CheckOutlined />}
              disabled={detailRecord.status !== "PENDING" || actionLoading}
              loading={actionLoading}
              onClick={() => handleApprove(detailRecord.id)}
            >
              Approve
            </Button>
          ) : null,
          detailRecord ? (
            <Button
              key="reject"
              danger
              icon={<CloseOutlined />}
              disabled={detailRecord.status !== "PENDING" || actionLoading}
              loading={actionLoading}
              onClick={() => openReject(detailRecord.id)}
            >
              Reject
            </Button>
          ) : null,
        ]}
      >
        {detailLoading ? (
          <Typography.Paragraph>Loading…</Typography.Paragraph>
        ) : detailRecord ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Card size="small" className="!border-slate-200/80 !bg-slate-50 !shadow-none">
                <Typography.Text type="secondary" className="!text-xs">
                  Current status
                </Typography.Text>
                <div className="mt-2">{statusTag(detailRecord.status)}</div>
              </Card>
              <Card size="small" className="!border-slate-200/80 !bg-slate-50 !shadow-none">
                <Typography.Text type="secondary" className="!text-xs">
                  Registered
                </Typography.Text>
                <Typography.Text className="!mt-2 !block !font-medium">{formatDateTime(detailRecord.createdAt)}</Typography.Text>
              </Card>
              <Card size="small" className="!border-slate-200/80 !bg-slate-50 !shadow-none">
                <Typography.Text type="secondary" className="!text-xs">
                  Contact email
                </Typography.Text>
                <Typography.Text className="!mt-2 !block !font-medium">{user?.email || detailRecord.contact_email || "—"}</Typography.Text>
              </Card>
            </div>

            <Card size="small" className="!rounded-2xl !border-slate-200/80 !shadow-sm">
              <Typography.Title level={5} className="!mb-3 !text-slate-900">
                Profile
              </Typography.Title>
              <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Legal name">{detailRecord.legal_name || "—"}</Descriptions.Item>
                <Descriptions.Item label="Trading name">{detailRecord.trading_name || "—"}</Descriptions.Item>
                <Descriptions.Item label="Company no. / UTR">
                  {detailRecord.company_number_or_utr || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Status">{statusTag(detailRecord.status)}</Descriptions.Item>
                <Descriptions.Item label="Contact name">{detailRecord.contact_name || "—"}</Descriptions.Item>
                <Descriptions.Item label="Contact email">{detailRecord.contact_email || "—"}</Descriptions.Item>
                <Descriptions.Item label="Contact phone">{detailRecord.contact_phone || "—"}</Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {[detailRecord.address_line1, detailRecord.address_line2, detailRecord.city, detailRecord.postcode]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="User email">{user?.email || "—"}</Descriptions.Item>
                <Descriptions.Item label="Registered">{formatDateTime(detailRecord.createdAt)}</Descriptions.Item>
                {(detailRecord.rejectionReason ?? detailRecord.rejection_reason) ? (
                  <Descriptions.Item label="Rejection reason" span={2}>
                    {detailRecord.rejectionReason ?? detailRecord.rejection_reason}
                  </Descriptions.Item>
                ) : null}
              </Descriptions>
            </Card>

            <Card size="small" className="!rounded-2xl !border-slate-200/80 !shadow-sm">
              <Typography.Title level={5} className="!mb-3 !text-slate-900">
                Documents
              </Typography.Title>
              {documents.length === 0 && !verificationDocs ? (
                <Empty description="No documents uploaded" />
              ) : (
                <Space direction="vertical" size="middle" className="w-full">
                  {documents.length > 0 ? (
                    <Table
                      size="small"
                      pagination={false}
                      bordered
                      rowKey={(r) => r.id ?? `${r.category}-${r.storage_path}`}
                      columns={[
                        { title: "Category", dataIndex: "category", key: "category" },
                        {
                          title: "File",
                          key: "file",
                          render: (_, r) => r.original_filename || r.storage_path || "—",
                        },
                        {
                          title: "Download",
                          key: "dl",
                          width: 120,
                          render: (_, r) => {
                            const href = fileHref(r.storage_path);
                            return href ? (
                              <a href={href} target="_blank" rel="noopener noreferrer">
                                <DownloadOutlined /> Open
                              </a>
                            ) : (
                              "—"
                            );
                          },
                        },
                      ]}
                      dataSource={documents}
                    />
                  ) : null}

                  {verificationDocs ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <Typography.Text strong className="mb-2 block text-slate-700">
                        Verification bundle
                      </Typography.Text>
                      <Descriptions bordered size="small" column={1}>
                        {VERIFICATION_DOC_KEYS.map(([key, label]) => {
                          const path = verificationDocs[key];
                          const href = fileHref(path);
                          return (
                            <Descriptions.Item key={key} label={label}>
                              {href ? (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                  <DownloadOutlined /> Download
                                </a>
                              ) : (
                                "—"
                              )}
                            </Descriptions.Item>
                          );
                        })}
                        {verificationDocs.status ? (
                          <Descriptions.Item label="Verification status">
                            <Tag>{verificationDocs.status}</Tag>
                          </Descriptions.Item>
                        ) : null}
                      </Descriptions>
                    </div>
                  ) : null}
                </Space>
              )}
            </Card>

            <Card size="small" className="!rounded-2xl !border-slate-200/80 !shadow-sm">
              <Typography.Title level={5} className="!mb-3 !text-slate-900">
                Compliance
              </Typography.Title>
              {!compliance ? (
                <Empty description="No compliance record" />
              ) : (
                <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="AML supervisory body">
                    {compliance.aml_supervisory_body || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="AML registration ref">
                    {compliance.aml_registration_reference || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="PI cover">
                    {compliance.pi_cover_amount != null
                      ? `${compliance.pi_cover_currency || "GBP"} ${compliance.pi_cover_amount}`
                      : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="PI expires">
                    {compliance.pi_certificate_expires_on || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="ICO number">{compliance.ico_registration_number || "—"}</Descriptions.Item>
                  <Descriptions.Item label="GDPR controls">
                    {compliance.gdpr_controls_confirmed ? "Yes" : "No"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last review" span={2}>
                    {formatDateTime(compliance.last_compliance_review_at)}
                  </Descriptions.Item>
                  {compliance.notes ? (
                    <Descriptions.Item label="Notes" span={2}>
                      {compliance.notes}
                    </Descriptions.Item>
                  ) : null}
                </Descriptions>
              )}
            </Card>
          </div>
        ) : (
          <Empty />
        )}
      </Modal>

      <Modal
        title="Reject application"
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onOk={confirmReject}
        okText="Reject"
        okButtonProps={{ danger: true, loading: actionLoading }}
        destroyOnClose
      >
        <Typography.Paragraph type="secondary">
          Optional message shown to the accountant (stored as rejection reason).
        </Typography.Paragraph>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Reason for rejection"
        />
      </Modal>
    </div>
  );
}
