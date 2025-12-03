import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad - Conarte",
  description: "Aviso de privacidad de Conarte - Información sobre el tratamiento de datos personales",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Aviso de Privacidad
      </h1>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Última actualización: 2 de diciembre de 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Responsable del Tratamiento de Datos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Conarte, con domicilio en Monterrey, Nuevo León, México, es responsable del tratamiento 
            de sus datos personales de conformidad con la Ley Federal de Protección de Datos Personales 
            en Posesión de los Particulares.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Datos Personales Recabados
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar sus 
            datos personales de distintas formas: cuando usted nos los proporciona directamente; 
            cuando visita nuestro sitio web o utiliza nuestros servicios en línea.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Los datos personales que recabamos de forma directa incluyen:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número telefónico</li>
            <li>Dirección</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Finalidades del Tratamiento
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Los datos personales que recabamos serán utilizados para las siguientes finalidades:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
            <li>Proveer los servicios y productos que ha solicitado</li>
            <li>Informar sobre cambios en nuestros servicios</li>
            <li>Evaluar la calidad del servicio</li>
            <li>Realizar análisis estadísticos y de tendencias</li>
            <li>Enviar información promocional sobre eventos culturales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Derechos ARCO
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos 
            y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la 
            corrección de su información personal en caso de que esté desactualizada, sea inexacta o 
            incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando 
            considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse 
            al uso de sus datos personales para fines específicos (Oposición).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Transferencia de Datos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Le informamos que sus datos personales pueden ser transferidos y tratados dentro y fuera del 
            país, por personas distintas a esta organización. En ese sentido, su información puede ser 
            compartida con proveedores de servicios que nos ayuden a operar nuestro negocio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Cambios al Aviso de Privacidad
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas 
            de nuevos requerimientos legales; de nuestras propias necesidades por los productos o servicios 
            que ofrecemos; de nuestras prácticas de privacidad; de cambios en nuestro modelo de negocio, o 
            por otras causas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. Contacto
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Para cualquier duda o solicitud relacionada con este aviso de privacidad, puede contactarnos en:
          </p>
          <ul className="list-none text-gray-600 dark:text-gray-400 mb-4 space-y-2">
            <li><strong>Email:</strong> privacidad@conarte.com</li>
            <li><strong>Teléfono:</strong> +52 (81) 1234-5678</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
