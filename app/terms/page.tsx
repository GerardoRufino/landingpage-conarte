import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Conarte",
  description: "Términos y condiciones de uso del sitio web de Conarte",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Términos y Condiciones
      </h1>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Última actualización: 2 de diciembre de 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            1. Aceptación de los Términos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones 
            de uso, todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento 
            de todas las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, 
            tiene prohibido usar o acceder a este sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            2. Uso del Sitio
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Este sitio web es propiedad de Conarte. El uso de este sitio está sujeto a las siguientes 
            condiciones:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
            <li>No debe usar este sitio de ninguna manera que cause, o pueda causar, daño al sitio</li>
            <li>No debe usar este sitio de ninguna manera que afecte el acceso del usuario al sitio</li>
            <li>No debe usar este sitio de manera contraria a las leyes y regulaciones aplicables</li>
            <li>No debe usar este sitio para copiar, almacenar, alojar, transmitir, enviar, usar, publicar o distribuir cualquier material que consista en (o esté vinculado a) cualquier spyware, virus informático, troyano, gusano, registrador de pulsaciones de teclas, rootkit u otro software informático malicioso</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            3. Propiedad Intelectual
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El contenido de este sitio web, incluyendo pero no limitado a textos, gráficos, imágenes, 
            logos, iconos de botones, software y otros materiales (el "Contenido") es propiedad de Conarte 
            o de sus proveedores de contenido y está protegido por las leyes mexicanas e internacionales 
            de propiedad intelectual.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Todo el Contenido está protegido por derechos de autor como una obra colectiva bajo las leyes 
            de derechos de autor de México y otras leyes de derechos de autor. Usted acepta cumplir con 
            todas las leyes de derechos de autor en todo el mundo en su uso de este sitio web y evitar 
            que otros lo hagan.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            4. Limitación de Responsabilidad
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            En ningún caso Conarte será responsable de ningún daño (incluyendo, sin limitación, daños por 
            pérdida de datos o ganancias, o debido a la interrupción del negocio) que surja del uso o la 
            incapacidad de usar los materiales en el sitio web de Conarte, incluso si Conarte o un 
            representante autorizado de Conarte ha sido notificado oralmente o por escrito de la posibilidad 
            de tal daño.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            5. Exactitud de los Materiales
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Los materiales que aparecen en el sitio web de Conarte pueden incluir errores técnicos, 
            tipográficos o fotográficos. Conarte no garantiza que ninguno de los materiales en su sitio 
            web sea preciso, completo o actual. Conarte puede realizar cambios en los materiales contenidos 
            en su sitio web en cualquier momento sin previo aviso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            6. Enlaces a Terceros
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Conarte no ha revisado todos los sitios vinculados a su sitio web y no es responsable del 
            contenido de ningún sitio vinculado. La inclusión de cualquier enlace no implica respaldo por 
            parte de Conarte del sitio. El uso de cualquier sitio web vinculado es por cuenta y riesgo del 
            usuario.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            7. Modificaciones
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Conarte puede revisar estos términos de servicio para su sitio web en cualquier momento sin 
            previo aviso. Al usar este sitio web, usted acepta estar sujeto a la versión actual de estos 
            términos y condiciones de uso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            8. Ley Aplicable
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de México y usted 
            se somete irrevocablemente a la jurisdicción exclusiva de los tribunales en ese estado o 
            ubicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            9. Contacto
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos:
          </p>
          <ul className="list-none text-gray-600 dark:text-gray-400 mb-4 space-y-2">
            <li><strong>Email:</strong> contacto@conarte.com</li>
            <li><strong>Teléfono:</strong> +52 (81) 1234-5678</li>
            <li><strong>Dirección:</strong> Monterrey, Nuevo León, México</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
