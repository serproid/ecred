import { Logo } from './Logo'
import {
  ArrowDownIcon,
  BoltIcon,
  CheckIcon,
  CrossIcon,
} from './icons'

function TransferCard() {
  return (
    <div className="transfer__wrap">
      <div className="transfer">
        <div className="transfer__top">
          <span className="transfer__icon">
            <ArrowDownIcon />
          </span>
          <div>
            <p className="transfer__title">Transferência Recebida</p>
            <p className="transfer__time">Agora mesmo</p>
          </div>
        </div>

        <div className="transfer__amount">
          <span>Valor recebido</span>
          <strong>R$ 15.000,00</strong>
        </div>

        <div className="transfer__rows">
          <div>
            <span>Remetente</span>
            <strong>Ecred Pagamentos</strong>
          </div>
          <div>
            <span>Instituição</span>
            <strong>Banco Genético S.A.</strong>
          </div>
        </div>

        <button type="button" className="transfer__btn">
          Ver comprovante
        </button>
      </div>

      <div className="approved">
        <span className="approved__check">
          <CheckIcon size={16} />
        </span>
        <div>
          <strong>Aprovado</strong>
          <span>Em 2 minutos</span>
        </div>
      </div>
    </div>
  )
}

function LiveFeed() {
  return (
    <div className="live">
      <div className="live__head">
        <span className="live__dot" />
        <span>AO VIVO</span>
        <span className="live__count">429 pessoas acabando agora</span>
      </div>
      <ul className="live__list">
        <li>
          <span className="live__ico live__ico--no">
            <CrossIcon />
          </span>
          <div className="live__text">
            <p>Pedro C. não passou na análise desta vez</p>
            <span>Porto Alegre, RS</span>
          </div>
        </li>
        <li>
          <span className="live__ico live__ico--ok">
            <CheckIcon />
          </span>
          <div className="live__text">
            <p>Pedro C. recebeu R$ 2.124,53 via Pix</p>
            <span>Porto Alegre, RS</span>
          </div>
        </li>
        <li>
          <span className="live__ico live__ico--ok">
            <CheckIcon />
          </span>
          <div className="live__text">
            <p>João S. recebeu R$ 7.392,00 via Pix</p>
            <span>São Paulo, SP</span>
          </div>
        </li>
      </ul>
    </div>
  )
}

export function Hero() {
  return (
    <header className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__pattern" aria-hidden="true" />

      <div className="site-header container">
        <Logo />
      </div>

      <div className="hero__layout container">
        <div className="hero__left">
          <span className="hero__badge">
            <BoltIcon size={13} />
            Crédito pessoal pré-aprovado
          </span>

          <h1 className="hero__title">
            Até R$ 20.000
            <span className="lime">direto no seu PIX</span>
          </h1>

          <p className="hero__sub">
            Simule grátis sem sair de casa e receba via Pix,{' '}
            <strong>mesmo negativado.</strong> Crédito rápido, com parcelas que
            cabem no seu bolso.
          </p>

          <button type="button" className="btn btn--lime hero__cta">
            Simular meu crédito
          </button>

          <ul className="hero__checks">
            <li>
              <CheckIcon /> Aprova negativado
            </li>
            <li>
              <CheckIcon /> Sem fiador
            </li>
            <li>
              <CheckIcon /> Pix em 10 min
            </li>
          </ul>
        </div>

        <div className="hero__right">
          <TransferCard />
        </div>
      </div>

      <div className="live-wrap container">
        <LiveFeed />
      </div>
    </header>
  )
}
