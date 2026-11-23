import { motion } from 'framer-motion'

const stats = [
  { value: '+180 mil', label: ['brasileiros', 'atendidos'] },
  { value: '~20 min', label: ['para cair', 'via Pix'] },
  { value: 'R$ 640 mi', label: ['liberados', 'em crédito'] },
]

export function Stats() {
  return (
    <section className="bg-[#f4f7f4] py-10 md:py-14">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-[#1a231d] border border-white/10 rounded-3xl px-4 py-7 md:px-10 md:py-9 shadow-2xl"
        >
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat) => (
              <div
                className="text-center px-2 md:px-6"
                key={stat.value}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary tracking-tight whitespace-nowrap">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs sm:text-sm md:text-base text-white/75 leading-snug">
                  {stat.label[0]}
                  <br />
                  {stat.label[1]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
