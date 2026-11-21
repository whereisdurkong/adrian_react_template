import { useEffect, useState } from "react";
import {
  ArrowRight,
  DownloadSimple,
  Folder,
  Image as ImageIcon,
  Play,
  Plus,
  Table,
  Trash,
  VideoCamera,
} from "@phosphor-icons/react";

// Adjust these two paths to wherever your buttons live
import Button from "../components/ui/Button";
import ButtonAnimated from "../components/ui/ButtonAnimated";
import Loader from "../components/ui/Loader";
import { ToastCard, useToast } from "../components/ui/Toast";
import DeleteModal, { DeleteModalPanel } from "../components/ui/DeleteModal";
import Modal, {
  ModalMedia,
  ModalPanel,
  ModalTable,
} from "../components/ui/Modal";

import styles from "../styles/pages/Components.module.css";

/* Reads a CSS variable and re-reads it when data-theme changes,
   same approach as the Palette page. Needed because the canvas in
   ButtonAnimated can't accept var(--x), it needs a real color value. */
function useCssVar(name) {
  const read = () =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [value, setValue] = useState(read);

  useEffect(() => {
    const update = () => setValue(read());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return value;
}

const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const PREVIEW_CLASS = { sm: "previewSm", md: "previewMd", lg: "previewLg" };

// Sample rows for the Modal table demo
const INVOICES = [
  {
    id: "INV-1042",
    client: "Northwind Studio",
    date: "Nov 18, 2026",
    status: "Paid",
    amount: "$2,400.00",
  },
  {
    id: "INV-1041",
    client: "Bluebird Labs",
    date: "Nov 14, 2026",
    status: "Pending",
    amount: "$1,150.00",
  },
  {
    id: "INV-1040",
    client: "Harbor & Co.",
    date: "Nov 09, 2026",
    status: "Paid",
    amount: "$860.50",
  },
  {
    id: "INV-1039",
    client: "Mono Collective",
    date: "Nov 02, 2026",
    status: "Failed",
    amount: "$3,200.00",
  },
  {
    id: "INV-1038",
    client: "Lumen Works",
    date: "Oct 28, 2026",
    status: "Paid",
    amount: "$740.00",
  },
];

export default function Components() {
  const purple = useCssVar("--purple");
  const toast = useToast();

  // Live DeleteModal demo
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Live Modal demos: "sm" | "md" | "lg" | "table" | "image" | "video" | null
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  const confirmDelete = () => {
    setDeleting(true);
    // Pretend the request takes a moment
    setTimeout(() => {
      setDeleting(false);
      setDeleteOpen(false);
      toast.success("Project deleted");
    }, 1200);
  };

  /* Content reused by the static previews and the live Modal demos */
  const statusClass = {
    Paid: styles.paid,
    Pending: styles.pending,
    Failed: styles.failed,
  };

  const invoiceTable = (
    <ModalTable>
      <table>
        <thead>
          <tr>
            <th scope="col">Invoice</th>
            <th scope="col">Client</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col" className={styles.num}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {INVOICES.map((row) => (
            <tr key={row.id}>
              <td>
                <code className={styles.mono}>{row.id}</code>
              </td>
              <td>{row.client}</td>
              <td>{row.date}</td>
              <td>
                <span className={`${styles.status} ${statusClass[row.status]}`}>
                  {row.status}
                </span>
              </td>
              <td className={styles.num}>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalTable>
  );

  const imageContent = (
    <ModalMedia ratio="16 / 10" caption="Abstract gradient · 2400 × 1500">
      {/* Swap this placeholder for: <img src="..." alt="..." /> */}
      <div
        className={styles.artImage}
        role="img"
        aria-label="Abstract purple and lime gradient"
      />
    </ModalMedia>
  );

  const videoContent = (
    <ModalMedia ratio="16 / 9" caption="Product tour · 2:14">
      {/* Swap this placeholder for: <video controls poster="..." src="..." /> */}
      <div className={styles.artVideo}>
        <button type="button" className={styles.play} aria-label="Play video">
          <Play size={28} weight="fill" aria-hidden="true" />
        </button>
      </div>
    </ModalMedia>
  );

  const closeFooter = (
    <Button variant="secondary" onClick={closeModal}>
      Close
    </Button>
  );

  const tableFooter = (
    <>
      <Button variant="secondary" onClick={closeModal}>
        Close
      </Button>
      <Button onClick={closeModal}>
        <DownloadSimple size={16} weight="bold" aria-hidden="true" />
        Export CSV
      </Button>
    </>
  );

  const isSizeDemo = ["sm", "md", "lg"].includes(modal);

  /* Registry: add an entry here and it shows up on the page and in the jump nav. */
  const components = [
    {
      id: "button",
      name: "Button",
      description:
        "Standard button. Variants: primary, secondary, ghost, dark, danger. Sizes: sm (32), md (40), lg (48).",
      sections: [
        {
          title: "Variants",
          items: ["primary", "secondary", "ghost", "dark", "danger"].map(
            (v) => ({
              label: v,
              node: <Button variant={v}>{cap(v)}</Button>,
            }),
          ),
        },
        {
          title: "Sizes",
          items: ["sm", "md", "lg"].map((s) => ({
            label: s,
            node: <Button size={s}>Button {s}</Button>,
          })),
        },
        {
          title: "With icon",
          items: [
            {
              label: "icon left",
              node: (
                <Button>
                  <Plus size={16} weight="bold" aria-hidden="true" />
                  New item
                </Button>
              ),
            },
            {
              label: "icon right",
              node: (
                <Button variant="secondary">
                  Continue
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </Button>
              ),
            },
            {
              label: "danger",
              node: (
                <Button variant="danger">
                  <Trash size={16} weight="bold" aria-hidden="true" />
                  Delete
                </Button>
              ),
            },
          ],
        },
        {
          title: "States",
          items: [
            { label: "default", node: <Button>Default</Button> },
            { label: "disabled", node: <Button disabled>Disabled</Button> },
            {
              label: "disabled secondary",
              node: (
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              ),
            },
          ],
        },
        {
          title: "Full width",
          items: [
            {
              label: "fullWidth",
              node: (
                <div className={styles.fullDemo}>
                  <Button fullWidth>Full width button</Button>
                </div>
              ),
            },
          ],
        },
      ],
    },
    {
      id: "button-animated",
      name: "ButtonAnimated",
      description:
        "Liquid-fill hover button, same sizes as Button. Variants: solid, outline. Hover to see the effect.",
      sections: [
        {
          title: "Variants",
          items: ["solid", "outline"].map((v) => ({
            label: v,
            node: <ButtonAnimated variant={v}>{cap(v)}</ButtonAnimated>,
          })),
        },
        {
          title: "Sizes",
          items: ["sm", "md", "lg"].map((s) => ({
            label: s,
            node: (
              <ButtonAnimated size={s} variant="solid">
                Button {s}
              </ButtonAnimated>
            ),
          })),
        },
        {
          title: "With icon",
          items: [
            {
              label: "icon left",
              node: (
                <ButtonAnimated icon={Plus} iconPosition="left">
                  New item
                </ButtonAnimated>
              ),
            },
            {
              label: "icon right",
              node: (
                <ButtonAnimated
                  icon={ArrowRight}
                  iconPosition="right"
                  variant="outline"
                >
                  Continue
                </ButtonAnimated>
              ),
            },
          ],
        },
        {
          title: "Custom fill",
          items: [
            {
              label: "fill = --purple",
              node: (
                <ButtonAnimated
                  fill={purple || undefined}
                  onFill="var(--text-on-dark)"
                >
                  Purple fill
                </ButtonAnimated>
              ),
            },
          ],
        },
        {
          title: "States",
          items: [
            {
              label: "default",
              node: <ButtonAnimated>Default</ButtonAnimated>,
            },
            {
              label: "disabled",
              node: <ButtonAnimated disabled>Disabled</ButtonAnimated>,
            },
            {
              label: "as link",
              node: (
                <ButtonAnimated as="a" href="#button-animated">
                  Link button
                </ButtonAnimated>
              ),
            },
          ],
        },
        {
          title: "Compared with Button",
          items: ["sm", "md", "lg"].map((s) => ({
            label: `${s}: Button + ButtonAnimated`,
            node: (
              <div className={styles.pair}>
                <Button size={s}>Button</Button>
                <ButtonAnimated size={s} variant="outline">
                  Animated
                </ButtonAnimated>
              </div>
            ),
          })),
        },
      ],
    },
    {
      id: "loader",
      name: "Loader",
      description:
        "Loading animation. In the app it covers the whole screen; here it is shown inside a card. Sizes: sm, md, lg.",
      sections: [
        {
          title: "Sizes",
          items: ["sm", "md", "lg"].map((s) => ({
            label: `size="${s}"`,
            node: (
              <div className={`${styles.preview} ${styles[PREVIEW_CLASS[s]]}`}>
                <Loader size={s} />
              </div>
            ),
          })),
        },
      ],
    },
    {
      id: "toast",
      name: "Toast",
      description:
        "Short notification that slides in at the bottom right (full width on mobile). Types: default, success, error, info. Hover or focus a toast to pause its timer. Needs <ToastProvider> around the app.",
      sections: [
        {
          title: "Types (static preview)",
          items: [
            {
              label: "default",
              node: (
                <div className={styles.toastDemo}>
                  <ToastCard
                    title="Settings updated"
                    description="Your preferences were applied."
                    onClose={() => {}}
                  />
                </div>
              ),
            },
            {
              label: "success",
              node: (
                <div className={styles.toastDemo}>
                  <ToastCard
                    type="success"
                    title="Changes saved"
                    description="Your profile is up to date."
                    onClose={() => {}}
                  />
                </div>
              ),
            },
            {
              label: "error",
              node: (
                <div className={styles.toastDemo}>
                  <ToastCard
                    type="error"
                    title="Upload failed"
                    description="Check your connection and try again."
                    onClose={() => {}}
                  />
                </div>
              ),
            },
            {
              label: "info",
              node: (
                <div className={styles.toastDemo}>
                  <ToastCard
                    type="info"
                    title="New version available"
                    description="Refresh to get the latest update."
                    onClose={() => {}}
                  />
                </div>
              ),
            },
          ],
        },
        {
          title: "Variations (static preview)",
          items: [
            {
              label: "title only",
              node: (
                <div className={styles.toastDemo}>
                  <ToastCard type="success" title="Copied to clipboard" />
                </div>
              ),
            },
            {
              label: "with action",
              node: (
                <div className={styles.toastDemo}>
                  <ToastCard
                    title="Item deleted"
                    description="It will be removed permanently in 30 days."
                    action={{ label: "Undo" }}
                    onClose={() => {}}
                  />
                </div>
              ),
            },
          ],
        },
        {
          title: "Trigger live",
          items: [
            {
              label: "toast()",
              node: (
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast("Settings updated", {
                      description: "Your preferences were applied.",
                    })
                  }
                >
                  Default
                </Button>
              ),
            },
            {
              label: "toast.success()",
              node: (
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.success("Changes saved", {
                      description: "Your profile is up to date.",
                    })
                  }
                >
                  Success
                </Button>
              ),
            },
            {
              label: "toast.error()",
              node: (
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.error("Upload failed", {
                      description: "Check your connection and try again.",
                    })
                  }
                >
                  Error
                </Button>
              ),
            },
            {
              label: "toast.info()",
              node: (
                <Button
                  variant="secondary"
                  onClick={() => toast.info("New version available")}
                >
                  Info
                </Button>
              ),
            },
            {
              label: "action, 6s",
              node: (
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.show({
                      title: "Item deleted",
                      duration: 6000,
                      action: {
                        label: "Undo",
                        onClick: () => toast.success("Item restored"),
                      },
                    })
                  }
                >
                  With action
                </Button>
              ),
            },
            {
              label: "duration: 0",
              node: (
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.show({
                      title: "Stays until dismissed",
                      description: "Use the close button.",
                      duration: 0,
                    })
                  }
                >
                  Persistent
                </Button>
              ),
            },
          ],
        },
      ],
    },
    {
      id: "delete-modal",
      name: "DeleteModal",
      description:
        "Confirmation dialog for destructive actions. Built on the native <dialog>: focus stays inside, Esc and clicking outside cancel, and focus starts on Cancel so Enter can't delete by accident.",
      sections: [
        {
          title: "Preview (static, on the dim layer)",
          items: [
            {
              label: "default",
              node: (
                <div className={styles.modalDemo}>
                  <DeleteModalPanel />
                </div>
              ),
            },
            {
              label: "custom text",
              node: (
                <div className={styles.modalDemo}>
                  <DeleteModalPanel
                    title="Delete this project?"
                    description="All tasks and files in it will be removed permanently."
                    itemName="Website redesign"
                    itemIcon={Folder}
                    confirmLabel="Delete project"
                  />
                </div>
              ),
            },
            {
              label: "loading={true}",
              node: (
                <div className={styles.modalDemo}>
                  <DeleteModalPanel loading />
                </div>
              ),
            },
          ],
        },
        {
          title: "Trigger live",
          items: [
            {
              label: "open={true}",
              node: (
                <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                  Delete project
                </Button>
              ),
            },
          ],
        },
      ],
    },
    {
      id: "modal",
      name: "Modal",
      description:
        "General modal for tables, images, video or any content. Sizes: sm, md, lg, xl. The body scrolls on its own, the header and footer stay put, and below 900px it becomes a bottom sheet. Use ModalTable and ModalMedia for common content.",
      sections: [
        {
          title: "Preview (static, on the dim layer)",
          items: [
            {
              label: 'table, size="lg"',
              node: (
                <div className={styles.wideDemo}>
                  <ModalPanel
                    size="lg"
                    icon={Table}
                    title="Recent invoices"
                    description="Last 30 days of billing activity"
                    footer={tableFooter}
                  >
                    {invoiceTable}
                  </ModalPanel>
                </div>
              ),
            },
            {
              label: 'image, size="md"',
              node: (
                <div className={styles.wideDemo}>
                  <ModalPanel
                    size="md"
                    icon={ImageIcon}
                    title="Image preview"
                    description="Use ModalMedia for images, video or iframes"
                    footer={closeFooter}
                  >
                    {imageContent}
                  </ModalPanel>
                </div>
              ),
            },
          ],
        },
        {
          title: "Sizes (live)",
          items: ["sm", "md", "lg"].map((s) => ({
            label: `size="${s}"`,
            node: (
              <Button variant="secondary" onClick={() => setModal(s)}>
                Open {s}
              </Button>
            ),
          })),
        },
        {
          title: "Content (live)",
          items: [
            {
              label: "table",
              node: (
                <Button variant="secondary" onClick={() => setModal("table")}>
                  Table
                </Button>
              ),
            },
            {
              label: "image",
              node: (
                <Button variant="secondary" onClick={() => setModal("image")}>
                  Image
                </Button>
              ),
            },
            {
              label: "video",
              node: (
                <Button variant="secondary" onClick={() => setModal("video")}>
                  Video
                </Button>
              ),
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Components</h1>
        <p className={styles.lead}>
          Every reusable component with its variants, sizes and states.
        </p>
        <nav className={styles.jump} aria-label="Jump to component">
          {components.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={styles.jumpLink}>
              {c.name}
            </a>
          ))}
        </nav>
      </header>

      {components.map((c) => (
        <section
          key={c.id}
          id={c.id}
          className={styles.component}
          aria-labelledby={`${c.id}-title`}
        >
          <h2 id={`${c.id}-title`} className={styles.componentTitle}>
            {c.name}
          </h2>
          <p className={styles.desc}>{c.description}</p>

          {c.sections.map((sec) => (
            <div key={sec.title} className={styles.block}>
              <h3 className={styles.blockTitle}>{sec.title}</h3>
              <div className={styles.card}>
                <div className={styles.row}>
                  {sec.items.map((item) => (
                    <div key={item.label} className={styles.cell}>
                      <div className={styles.demo}>{item.node}</div>
                      <code className={styles.label}>{item.label}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}

      <DeleteModal
        open={deleteOpen}
        loading={deleting}
        title="Delete this project?"
        description="All tasks and files in it will be removed permanently."
        itemName="Website redesign"
        itemIcon={Folder}
        confirmLabel="Delete project"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />

      <Modal
        open={isSizeDemo}
        size={isSizeDemo ? modal : "md"}
        icon={Folder}
        title={`Modal, size ${modal ?? ""}`}
        description="Any content goes in the body."
        footer={closeFooter}
        onClose={closeModal}
      >
        <p>
          The body scrolls on its own when the content gets long, while the
          header and footer stay in place. Press Esc, click outside, or use the
          close button to dismiss it.
        </p>
      </Modal>

      <Modal
        open={modal === "table"}
        size="lg"
        icon={Table}
        title="Recent invoices"
        description="Last 30 days of billing activity"
        footer={tableFooter}
        onClose={closeModal}
      >
        {invoiceTable}
      </Modal>

      <Modal
        open={modal === "image"}
        size="md"
        icon={ImageIcon}
        title="Image preview"
        description="Use ModalMedia for images, video or iframes"
        footer={closeFooter}
        onClose={closeModal}
      >
        {imageContent}
      </Modal>

      <Modal
        open={modal === "video"}
        size="lg"
        icon={VideoCamera}
        title="Product tour"
        description="See how it works in about two minutes"
        onClose={closeModal}
      >
        {videoContent}
      </Modal>
    </div>
  );
}
