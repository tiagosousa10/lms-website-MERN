import React from "react";

const NoNotificationsFound = () => {
  return (
    <div className="card bg-[#547792] p-6 text-center">
      <h3 className="font-semibold text-lg mb-2 text-white">
        Sem Notificações
      </h3>
      <p className="text-base-content opacity-70">
        Nenhuma notificação encontrada.
      </p>
    </div>
  );
};

export default NoNotificationsFound;
