import Link from 'next/link';

function renderChildren(children, keyPrefix) {
  return (children || []).map((child, index) => renderNode(child, `${keyPrefix}-${index}`));
}

function renderText(node, key) {
  let content = node.text || '';

  if (node.format & 1) content = <strong key={`${key}-bold`}>{content}</strong>;
  if (node.format & 2) content = <em key={`${key}-italic`}>{content}</em>;
  if (node.format & 8) content = <u key={`${key}-underline`}>{content}</u>;

  return <span key={key}>{content}</span>;
}

function renderNode(node, key) {
  if (!node) return null;

  if (node.type === 'text') {
    return renderText(node, key);
  }

  if (node.type === 'linebreak') {
    return <br key={key} />;
  }

  if (node.type === 'paragraph') {
    return (
      <p key={key} className="text-base leading-8 text-slate-700">
        {renderChildren(node.children, key)}
      </p>
    );
  }

  if (node.type === 'heading') {
    const Tag = node.tag || 'h2';
    return (
      <Tag key={key} className="text-2xl font-semibold tracking-normal text-slate-950">
        {renderChildren(node.children, key)}
      </Tag>
    );
  }

  if (node.type === 'quote') {
    return (
      <blockquote key={key} className="border-l-4 border-sky-200 pl-5 italic text-slate-700">
        {renderChildren(node.children, key)}
      </blockquote>
    );
  }

  if (node.type === 'list') {
    const Tag = node.listType === 'number' ? 'ol' : 'ul';
    return (
      <Tag key={key} className="space-y-3 pl-6 text-base leading-8 text-slate-700 marker:text-sky-600">
        {renderChildren(node.children, key)}
      </Tag>
    );
  }

  if (node.type === 'listitem') {
    return <li key={key}>{renderChildren(node.children, key)}</li>;
  }

  if (node.type === 'link') {
    const href = node.fields?.url || node.url || '#';
    return (
      <Link key={key} href={href} className="font-medium text-sky-700 underline-offset-4 hover:underline">
        {renderChildren(node.children, key)}
      </Link>
    );
  }

  if (Array.isArray(node.children)) {
    return <div key={key}>{renderChildren(node.children, key)}</div>;
  }

  return null;
}

export function RichTextRenderer({ content }) {
  const nodes = content?.root?.children || [];

  if (!Array.isArray(nodes) || nodes.length === 0) return null;

  return <div className="space-y-6">{renderChildren(nodes, 'node')}</div>;
}
