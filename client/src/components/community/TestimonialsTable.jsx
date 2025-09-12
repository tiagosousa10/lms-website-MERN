// components/community/MyTestimonialsTable.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContext";

export default function TestimonialsTable() {
  const {
    myTestimonials,
    fetchMyTestimonials,
    updateMyTestimonial,
    deleteMyTestimonial,
  } = useContext(AppContext);

  const [editing, setEditing] = useState(null);
  const editDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  useEffect(() => {
    fetchMyTestimonials();
  }, []);

  const openEdit = (t) => {
    setEditing({ _id: t._id, rating: t.rating, text: t.text });
    editDialogRef.current?.showModal();
  };

  const saveEdit = async () => {
    await updateMyTestimonial(editing._id, {
      rating: Number(editing.rating),
      text: editing.text.trim(),
    });
    editDialogRef.current?.close();
    setEditing(null);
  };

  const openDelete = (t) => {
    setEditing({ _id: t._id });
    deleteDialogRef.current?.showModal();
  };

  const confirmDelete = async () => {
    await deleteMyTestimonial(editing._id);
    deleteDialogRef.current?.close();
    setEditing(null);
  };

  return (
    <section className=" rounded-xl shadow p-4 md:p-6 bg-white mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Os meus testemunhos</h3>
        <button
          onClick={fetchMyTestimonials}
          className="btn btn-sm bg-[#ECEFCA] text-[#547792] hover:bg-[#547792] hover:text-[#ECEFCA] "
        >
          Recarregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Data</th>
              <th>Rating</th>
              <th>Texto</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {myTestimonials?.length ? (
              myTestimonials.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="badge badge-neutral">{t.rating}★</span>
                    </div>
                  </td>
                  <td className="max-w-[520px]">
                    <p className="line-clamp-2">{t.text}</p>
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      className="btn btn-xs px-5 bg-[#547792]"
                      onClick={() => openEdit(t)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-xs px-5 btn-error text-white"
                      onClick={() => openDelete(t)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center opacity-70">
                  Ainda não tens testemunhos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal editar */}
      <dialog ref={editDialogRef} className="modal">
        <div className="modal-box">
          <h4 className="font-semibold mb-3">Editar testemunho</h4>
          <div className="space-y-3">
            <label className="form-control">
              <span className="label-text">Avaliação (1–5)</span>
              <input
                type="number"
                min={1}
                max={5}
                className="input input-bordered w-24"
                value={editing?.rating ?? 5}
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev, rating: e.target.value }))
                }
              />
            </label>
            <label className="form-control">
              <span className="label-text">Testemunho</span>
              <textarea
                className="textarea textarea-bordered min-h-28"
                value={editing?.text ?? ""}
                onChange={(e) =>
                  setEditing((prev) => ({ ...prev, text: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button className="btn btn-ghost">Cancelar</button>
              <button
                type="button"
                onClick={saveEdit}
                className="btn btn-primary"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Modal remover */}
      <dialog ref={deleteDialogRef} className="modal">
        <div className="modal-box">
          <h4 className="font-semibold">Remover testemunho</h4>
          <p className="mt-2 opacity-80">Tens a certeza que queres remover?</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button className="btn btn-ghost">Cancelar</button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn btn-error  bg-red-400
            hover:bg-red-500"
              >
                Remover
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </section>
  );
}
