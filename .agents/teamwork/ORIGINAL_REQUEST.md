# Original User Request

## 2026-11-20T00:33:43Z

Implementar os 4 blocos finais da plataforma **Florável** em nível de produção (Monorepo Frontend em `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front` e Backend Spring Boot em `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`): fluxo completo de e-mail e recuperação de senha, integração real do Dashboard RH, sala de acolhimento com vídeo/áudio e notificações em tempo real, e upload de fotos de perfil compatível com S3/R2.

Working directory: C:\Users\danie\PROA\projetoDemoDay\Froravel-Front
Integrity mode: development

## Requirements

### R1. Fluxo Completo de E-mail e Recuperação de Senha
Implementar no backend (`modules/auth`) e no frontend (`apps/landing`) os fluxos de "Esqueci minha senha" e "Redefinir senha" com código temporário (expiração de 15 minutos, uso único, hash BCrypt) e envio de e-mail de boas-vindas/confirmação após a validação do cadastro.

### R2. Integração Real do Dashboard RH (`apps/rh`)
Substituir os dados mocados de `apps/rh` por chamadas HTTP reais aos endpoints existentes no `RhCorporativoController` do backend, incluindo tratamento de estados de carregamento, erro e fallback seguro.

### R3. Vídeo/Áudio e Notificações em Tempo Real
Integrar chamada de vídeo/áudio gratuita na `SalaAcolhimento` (`apps/psicologo` e `apps/mae`) utilizando SDK Jitsi Meet e implementar notificações em tempo real via Server-Sent Events (SSE) no backend (`modules/reuniao`) e frontend para avisar quando a psicóloga ou a mãe entrar na sala.

### R4. Upload de Foto de Perfil (S3 / Cloudflare R2)
Implementar endpoint e serviço no backend para geração de Presigned URL de upload de foto de perfil compatível com Amazon S3 / Cloudflare R2 (com validação de tipo/tamanho de imagem) e integrar o fluxo no perfil do usuário no frontend.

## Acceptance Criteria

### Compilação e Qualidade de Produção
- [ ] `npm run build:all` passa com 0 erros em `C:\Users\danie\PROA\projetoDemoDay\Froravel-Front`
- [ ] `.\mvnw.cmd clean test` passa com 0 falhas e 0 erros em `C:\Users\danie\PROA\projetoDemoDay\floravel-backend\Floravel`
- [ ] Novos fluxos (esqueci/redefinir senha, SSE, Presigned URL) possuem testes automatizados cobrindo casos de sucesso e erro (código expirado/inválido, arquivo inválido)
- [ ] Nenhuma credencial ou chave secreta hardcoded no código-fonte


## 2026-11-20T11:55:50Z

Quota has reset and the user requested to continue the work ("continue o trabalho"). Please resume execution from your handoff (`C:\Users\danie\PROA\projetoDemoDay\Froravel-Front\.agents\teamwork\sentinel\handoff.md` and `teamwork_preview_orchestrator_1\handoff.md`):
1. Complete the Milestone M2 Verification Gate (2 Reviewers, 2 Challengers, 1 Forensic Auditor).
2. Execute Milestone M3 (R3: Jitsi Meet SDK + SSE notifications).
3. Execute Milestone M4 (R4: AWS SDK v2 S3/R2 Presigned URLs + profile photo upload).
4. Execute Milestone M5 (Final E2E pass Tiers 1-4 + Tier 5 adversarial hardening + final build/test/secrets gate) and Final Victory Audit.

Proceed autonomously and report back when complete or if any blocker arises.


## 2026-11-20T12:27:10Z

IMPORTANT INSTRUCTION FROM USER: Once the current Milestone M2 Verification Gate finishes (and any M2 pass is recorded), STOP teamwork execution immediately — do NOT start Milestone M3, M4, or M5. Clean up your crons and report the M2 gate outcome back to the parent so we can implement M3 and M4 directly to conserve quota.
