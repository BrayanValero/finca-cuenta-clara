
import React from "react";
import { BookOpen } from "lucide-react";

const Documentacion: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] md:min-h-[500px] p-4 md:p-10 bg-gradient-to-tr from-farm-lightgreen/10 via-farm-lightgreen/20 to-farm-beige/70 dark:bg-gradient-to-br dark:from-farm-darkgreen/70 dark:to-farm-green/40 rounded-3xl shadow-lg">
      <div className="flex flex-col gap-2 items-center mb-6">
        <span className="rounded-full bg-farm-green/80 text-farm-beige px-4 py-2 shadow text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-fade-in">
          <BookOpen className="inline-block" size={18} />
          Documentación
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-farm-green dark:text-farm-beige text-center drop-shadow">
          Centro de Documentación
        </h1>
      </div>
      <div className="max-w-2xl mx-auto space-y-4 text-farm-darkgreen dark:text-farm-beige/90 text-base md:text-lg leading-relaxed">
        <p>
          Bienvenido a la sección de documentación del sistema. Aquí encontrarás guías, preguntas frecuentes y recursos útiles para sacar el máximo provecho de la plataforma.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <b>¿Cómo registrar nuevas transacciones?</b><br />
            Dirígete al módulo "Transacciones" y pulsa el botón <b>Agregar</b>.
          </li>
          <li>
            <b>¿Cómo generar informes?</b><br />
            Accede a la opción "Informes", selecciona el rango de fechas y pulsa <b>Generar</b>.
          </li>
          <li>
            <b>Puedes sugerir mejoras o reportar problemas</b> desde la sección de "Personal" o contactando a soporte.
          </li>
        </ul>
        <p>
          Si tienes dudas adicionales, ¡no dudes en consultarlas aquí o por los canales habituales!
        </p>
      </div>
    </div>
  );
};

export default Documentacion;
