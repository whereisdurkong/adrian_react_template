import { useEffect, useRef, useState } from "react";
import {
  AppWindow,
  ArrowRight,
  BellRinging,
  CircleNotch,
  CursorClick,
  DownloadSimple,
  Folder,
  Image as ImageIcon,
  Play,
  Plus,
  Sparkle,
  Table,
  Trash,
  VideoCamera,
  WarningCircle,
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

// Jump nav sizes (keep in sync with the CSS)
const NAV_HEIGHT = 52;
const NAV_GAP = 12;
const NAVBAR_HEIGHT = 72; // your top navbar (--navbar-height)

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

  // Jump nav: which section is currently in view
  const [active, setActive] = useState("");

  // Jump nav follow: the slot keeps its place in the page, and the nav
  // inside is moved down every frame so it stays below the navbar.
  const slotRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const slot = slotRef.current;
    const nav = navRef.current;
    if (!slot || !nav) return undefined;

    // Find the scrolling ancestor (your panel); null means the window scrolls
    let scroller = slot.parentElement;
    while (scroller && scroller !== document.body) {
      const s = getComputedStyle(scroller);
      if (/(auto|scroll|overlay)/.test(s.overflowY)) break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) scroller = null;
    console.log("[jump nav] scroll container:", scroller ?? "window");

    const page = slot.parentElement;
    let raf;
    let last = -1;

    const tick = () => {
      const base = scroller
        ? Math.max(scroller.getBoundingClientRect().top, 0)
        : 0;
      const r = slot.getBoundingClientRect();
      const pageEnd = page.getBoundingClientRect().bottom;
      const max = pageEnd - r.top - NAV_HEIGHT - NAV_GAP - NAVBAR_HEIGHT;
      const shift = Math.max(
        0,
        Math.min(base + NAVBAR_HEIGHT + NAV_GAP - r.top, max),
      );

      if (Math.abs(shift - last) > 0.5) {
        nav.style.transform = `translate3d(0, ${shift}px, 0)`;
        last = shift;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Jump nav: highlight the section currently in view
  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(id);
  };

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
      icon: CursorClick,
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
      icon: Sparkle,
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
      icon: CircleNotch,
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
      icon: BellRinging,
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
                    onClose={() => { }}
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
                    onClose={() => { }}
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
                    onClose={() => { }}
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
                    onClose={() => { }}
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
                    onClose={() => { }}
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
      icon: WarningCircle,
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
      icon: AppWindow,
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

  const countExamples = (c) =>
    c.sections.reduce((n, sec) => n + sec.items.length, 0);
  const totalExamples = components.reduce((n, c) => n + countExamples(c), 0);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.decor} aria-hidden="true">
          <span className={styles.orb} />
          <span className={styles.ring} />
          <span className={styles.pillA} />
          <span className={styles.pillB} />
          <span className={styles.dot} />
        </div>

        <div className={styles.heroBody}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Design system
          </span>
          <h1 className={styles.title}>
            <span className={styles.titleMark}>Components</span>
          </h1>
          <p className={styles.lead}>
            Every reusable component with its variants, sizes and states, in
            light and dark.
          </p>

          <ul className={styles.stats} aria-label="Library summary">
            <li className={styles.stat}>
              <span className={styles.statValue}>{components.length}</span>
              <span className={styles.statLabel}>Components</span>
            </li>
            <li className={styles.stat}>
              <span className={styles.statValue}>{totalExamples}</span>
              <span className={styles.statLabel}>Examples</span>
            </li>
            <li className={styles.stat}>
              <span className={styles.statValue}>2</span>
              <span className={styles.statLabel}>Themes</span>
            </li>
          </ul>
        </div>
      </header>

      {/* Jump nav: the slot keeps its place, the nav inside follows the scroll */}
      <div ref={slotRef} className={styles.jumpSlot}>
        <nav
          ref={navRef}
          className={styles.jump}
          aria-label="Jump to component"
        >
          {components.map((c) => {
            const Icon = c.icon;
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`${styles.jumpLink} ${isActive ? styles.jumpActive : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => jumpTo(e, c.id)}
              >
                <Icon size={16} weight="bold" aria-hidden="true" />
                {c.name}
              </a>
            );
          })}
        </nav>
      </div>

      {components.map((c, index) => {
        const Icon = c.icon;
        return (
          <section
            key={c.id}
            id={c.id}
            data-section
            className={styles.component}
            aria-labelledby={`${c.id}-title`}
          >
            <div className={styles.componentHead}>
              <span className={styles.iconTile} aria-hidden="true">
                <Icon size={26} weight="bold" />
              </span>
              <div className={styles.headText}>
                <div className={styles.titleRow}>
                  <h2 id={`${c.id}-title`} className={styles.componentTitle}>
                    {c.name}
                  </h2>
                  <span className={styles.count}>
                    {countExamples(c)} examples
                  </span>
                </div>
                <p className={styles.desc}>{c.description}</p>
              </div>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

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
        );
      })}

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