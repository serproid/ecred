import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Info, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FieldError } from '../components/FieldError'
import { Logo } from '../components/Logo'
import { ProgressBar } from '../components/ProgressBar'
import { formatCep, onlyDigits } from '../lib/formatters'
import { useSimulation } from '../lib/simulation'

const baseInput =
  'flex w-full border px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50'
const normalInput =
  'h-14 bg-background border-border text-lg rounded-xl focus-visible:ring-primary focus-visible:border-primary'
const errorInput =
  'h-14 bg-background text-lg rounded-xl border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500'
const disabledInput =
  'h-14 bg-muted border-border text-lg rounded-xl text-muted-foreground'

type ViaCepResponse = {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

export function EnderecoPage() {
  const navigate = useNavigate()
  const { data, update } = useSimulation()

  const [loading, setLoading] = useState(false)
  const [cepNotFound, setCepNotFound] = useState(false)
  const [touched, setTouched] = useState(false)
  const requestId = useRef(0)
  const lastFetchedCep = useRef(
    data.addressRevealed ? onlyDigits(data.cep) : '',
  )

  const errors = {
    cep:
      onlyDigits(data.cep).length !== 8 ? 'Informe um CEP válido.' : '',
    street: data.street.trim() ? '' : 'Informe o nome da rua.',
    number:
      !data.noNumber && !data.number.trim()
        ? 'Informe o número ou marque "Sem número".'
        : '',
    district: data.district.trim() ? '' : 'Informe o bairro.',
    city: data.city.trim() ? '' : 'Informe a cidade.',
    uf: data.uf.trim().length !== 2 ? 'UF' : '',
  }
  const hasError = Object.values(errors).some(Boolean)
  const errorFor = (key: keyof typeof errors) =>
    touched ? errors[key] : ''
  const inputClass = (key: keyof typeof errors) =>
    `${baseInput} ${errorFor(key) ? errorInput : normalInput}`

  const fetchCep = async (cepDigits: string) => {
    const id = requestId.current + 1
    requestId.current = id
    setLoading(true)
    setCepNotFound(false)

    try {
      const timeoutFn = (
        AbortSignal as unknown as {
          timeout?: (ms: number) => AbortSignal
        }
      ).timeout
      const response = await fetch(
        `https://viacep.com.br/ws/${cepDigits}/json/`,
        { signal: timeoutFn ? timeoutFn(8000) : undefined },
      )
      if (id !== requestId.current) return

      const result: ViaCepResponse = response.ok
        ? await response.json()
        : { erro: true }
      if (id !== requestId.current) return

      const resetFields =
        lastFetchedCep.current !== cepDigits
          ? { number: '', noNumber: false, complement: '' }
          : {}

      if (result.erro) {
        setCepNotFound(true)
        update({
          addressRevealed: true,
          street: '',
          district: '',
          city: '',
          uf: '',
          ...resetFields,
        })
      } else {
        update({
          addressRevealed: true,
          street: result.logradouro ?? '',
          district: result.bairro ?? '',
          city: result.localidade ?? '',
          uf: result.uf ?? '',
          ...resetFields,
        })
      }

      lastFetchedCep.current = cepDigits
    } catch {
      if (id !== requestId.current) return
      setCepNotFound(true)
      update({ addressRevealed: true })
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  const handleCepChange = (value: string) => {
    const masked = formatCep(value)
    update({ cep: masked })
    const digits = onlyDigits(masked)
    if (digits.length === 8) fetchCep(digits)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    setTouched(true)

    const digits = onlyDigits(data.cep)
    if (digits.length === 8 && !data.addressRevealed) {
      fetchCep(digits)
      return
    }

    if (!hasError) navigate('/conta')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-5 px-4 md:px-8 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="light" className="text-3xl" />
          </Link>
          <button
            type="button"
            onClick={() => navigate('/dia')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        <div className="max-w-2xl mx-auto w-full mt-4">
          <ProgressBar value={90} />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-8 md:pt-12 w-full max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div className="w-full">
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-[#2e5535] uppercase tracking-[0.15em] mb-3">
                Quase lá
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Endereço de cobrança
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Para onde enviamos o seu carnê e a documentação do contrato.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xl mb-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="00000-000"
                      value={data.cep}
                      onChange={(event) => handleCepChange(event.target.value)}
                      maxLength={9}
                      className={inputClass('cep')}
                    />
                    {loading ? (
                      <Loader2
                        size={20}
                        className="text-[#2e5535] animate-spin absolute right-4 top-1/2 -translate-y-1/2"
                      />
                    ) : null}
                  </div>
                  <FieldError message={errorFor('cep')} />
                </div>

                {data.addressRevealed ? (
                  <>
                    {cepNotFound ? (
                      <div className="flex items-start gap-3 bg-muted rounded-xl px-4 py-3 border border-border">
                        <Info
                          size={18}
                          className="text-[#2e5535] shrink-0 mt-0.5"
                        />
                        <p className="text-sm text-muted-foreground">
                          Não encontramos esse CEP na base dos Correios. Sem
                          problema: preencha o endereço manualmente abaixo.
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Rua
                      </label>
                      <input
                        value={data.street}
                        onChange={(event) =>
                          update({ street: event.target.value })
                        }
                        placeholder="Nome da rua"
                        className={inputClass('street')}
                      />
                      <FieldError message={errorFor('street')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Número
                        </label>
                        <input
                          value={data.noNumber ? 'S/N' : data.number}
                          onChange={(event) =>
                            update({ number: onlyDigits(event.target.value) })
                          }
                          placeholder="123"
                          disabled={data.noNumber}
                          className={
                            data.noNumber
                              ? `${baseInput} ${disabledInput}`
                              : inputClass('number')
                          }
                        />
                        <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={data.noNumber}
                            onChange={(event) =>
                              update({
                                noNumber: event.target.checked,
                                number: event.target.checked ? 'S/N' : '',
                              })
                            }
                            className="w-4 h-4 accent-[#2e5535] rounded"
                          />
                          <span className="text-sm text-muted-foreground">
                            Sem número
                          </span>
                        </label>
                        {!data.noNumber ? (
                          <FieldError message={errorFor('number')} />
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Complemento
                        </label>
                        <input
                          value={data.complement}
                          onChange={(event) =>
                            update({ complement: event.target.value })
                          }
                          placeholder="Opcional"
                          className={`${baseInput} ${normalInput}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bairro
                      </label>
                      <input
                        value={data.district}
                        onChange={(event) =>
                          update({ district: event.target.value })
                        }
                        placeholder="Bairro"
                        className={inputClass('district')}
                      />
                      <FieldError message={errorFor('district')} />
                    </div>

                    <div className="grid grid-cols-[1fr_6rem] gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Cidade
                        </label>
                        <input
                          value={data.city}
                          onChange={(event) =>
                            update({ city: event.target.value })
                          }
                          placeholder="Cidade"
                          className={inputClass('city')}
                        />
                        <FieldError message={errorFor('city')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          UF
                        </label>
                        <input
                          value={data.uf}
                          onChange={(event) =>
                            update({
                              uf: event.target.value
                                .replace(/[^a-zA-Z]/g, '')
                                .toUpperCase(),
                            })
                          }
                          placeholder="UF"
                          maxLength={2}
                          className={inputClass('uf')}
                        />
                        <FieldError message={errorFor('uf')} />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 bg-primary text-[#0f1712] font-bold h-16 text-lg md:text-xl rounded-full transition-all ${
                  loading
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-primary/90 hover:scale-[1.02] shadow-[0_0_30px_rgba(180,240,69,0.25)]'
                }`}
              >
                Continuar
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  )
}
