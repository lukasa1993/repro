import { prisma } from "./db.server";
import assert from "node:assert";
import type { Route } from "./+types/home";

export async function loader() {
  const notes = await prisma.note.findMany({
    select: { id: true, title: true, content: true },
  });
  return { notes };
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const { title, content } = Object.fromEntries(form);
  assert(typeof title === "string");
  assert(typeof content === "string");
  prisma.note.create({ data: { title, content } });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Home</h1>
      <div>
        <h2>Notes</h2>
        <form method="post">
          <input name="title" type="text" placeholder="Title" />
          <textarea name="content" placeholder="Content..." />
        </form>
        {loaderData.notes.length > 0 && (
          <ul>
            {loaderData.notes.map((note) => (
              <li key={note.id}>
                <b>{note.title}</b>
                <br />
                <small>{note.content}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
